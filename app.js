//! जय श्री कृष्ण
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cron = require('node-cron');

const { removeDuplicatePalettes, deleteIdenticalColorPalettes, removeInvalidHexPalettes } = require('./controllers/paletteController');
const config = require("./config/config");
const router = require("./routes/router");
const Palette = require("./models/Palette");
const Library = require("./models/Library");
const accounts = require("./models/accounts");

const app = express();
const PORT = config.port;
const http = require("http").Server(app);
const io = require("socket.io")(http);

const database = async () => {
    try {
        await mongoose.connect(config.database);
        console.log("Established database 💥");
    } catch (error) {
        console.log("Establishment failed 👎");
        setTimeout(database, 600000);
    }
}
database();

app.use("/", router);

io.on('connection', (socket) => {
    // testing
    console.log("a user connected");

    socket.on('toggle-like', async (data) => {
        try {
            const palette = await Palette.findOne({ code: data.paletteIdentity });
            if (palette) {
                if (palette.liked.includes(data.userId)) {
                    palette.liked.pull(data.userId);
                } else {
                    palette.liked.push(data.userId);
                    const user = await accounts.findOne({ identity: data.userId });
                    const data = await user.notifications.push({
                        app: "Color Lab",
                        comment: '',
                        name: user.name,
                        link: data.paletteIdentity,
                        identity: data.userId,
                    });
                }
                await palette.save();
                await data.save();
                io.emit('like-updated', { paletteIdentity: data.paletteIdentity, likes: palette.liked.length });
            }
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('toggle-report', async ({ userId, paletteIdentity }) => {
        try {
            const palette = await Palette.findOne({ code: paletteIdentity });
            if (!palette) {
                console.log('Palette not found');
                return;
            }
            const userIndex = palette.Report.indexOf(userId);
            if (userIndex === -1) {
                palette.Report.push(userId);
            } else {
                palette.Report.splice(userIndex, 1);
            }
            if (palette.Report.length >= 50) {
                await Palette.deleteOne({ code: paletteIdentity });
                io.emit('palette-deleted', { paletteIdentity });
            } else {
                await palette.save();
            }
            socket.emit('report-updated', { paletteIdentity, reported: palette.Report.includes(userId) });
        } catch (error) {
            console.log('Error in reporting palette:', error.message);
        }
    });

    socket.on('add-comment', async (data) => {
        try {
            const palette = await Palette.findOne({ code: data.paletteIdentity });
            if (palette) {
                palette.comments.push({ name: data.name, comment: data.comment });

                // Push a comment action object
                palette.actions.push({
                    userId: data.userId,
                    type: 'comment',
                    comment: data.comment,
                    timestamp: new Date() // Capture the timestamp
                });

                await palette.save();
                io.emit('comment-updated', { paletteIdentity: data.paletteIdentity, comments: palette.comments });
            }
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('toggle-save', async ({ userId, libraryCode }) => {
        try {
            const library = await Library.findOne({ code: libraryCode });
            if (library) {
                const userIndex = library.saved.indexOf(userId);
                if (userIndex === -1) {
                    library.saved.push(userId);
                    io.emit('save-updated', { libraryCode, saved: true });
                } else {
                    library.saved.splice(userIndex, 1);
                    io.emit('save-updated', { libraryCode, saved: false });
                }
                await library.save();
            } else {
                console.log('Library not found');
            }
        } catch (error) {
            console.error('Error in saving library:', error.message);
        }
    });

    socket.on('disconnect', () => {
    });
});

http.listen(PORT, () => {
    console.log("build completed ✨");
});

cron.schedule('*/15 * * * *', () => {
    removeDuplicatePalettes();
    deleteIdenticalColorPalettes();
    removeInvalidHexPalettes();
});

const url = "https://lemonteams.onrender.com";
const interval = 183000;
function reloadWebsite() {
    axios.get(url)
        .then(response => {
        })
        .catch(error => {
            console.error(error.message);
        });
}
setInterval(reloadWebsite, interval);
