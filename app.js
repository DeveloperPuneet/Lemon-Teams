const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cron = require('node-cron');

const { removeDuplicatePalettes } = require('./controllers/paletteController');
const config = require("./config/config");
const router = require("./routes/router");
const Palette = require("./models/Palette");

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
    console.log("a user connected");

    socket.on('toggle-like', async (data) => {
        try {
            const palette = await Palette.findOne({ code: data.paletteIdentity });
            if (palette) {
                if (palette.liked.includes(data.userId)) {
                    palette.liked.pull(data.userId);
                } else {
                    palette.liked.push(data.userId);
                }
                await palette.save();
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
                await palette.save();
                io.emit('comment-updated', { paletteIdentity: data.paletteIdentity, comments: palette.comments });
            }
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});

cron.schedule('*/15 * * * *', () => {
    removeDuplicatePalettes();
});

const url = "https://lemonteams.onrender.com/";
const interval = 10000;
function reloadWebsite() {
    axios.get(url)
        .then(response => {
            // Optional: Handle successful response if needed
        })
        .catch(error => {
            console.error(error.message);
        });
}
setInterval(reloadWebsite, interval);
