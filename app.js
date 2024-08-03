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
    socket.on('toggle-like', async (data) => {
        const { userId, paletteIdentity } = data;
        const palette = await Palette.findOne({ code: paletteIdentity });
        if (palette.liked.includes(userId)) {
            palette.liked = palette.liked.filter(id => id !== userId);
        } else {
            palette.liked.push(userId);
        }
        await palette.save();
        io.emit('like-updated', {
            paletteIdentity,
            likes: palette.liked.length
        });
    });

    socket.on('add-comment', async ({ name, comment, paletteIdentity }) => {
        try {
            const palette = await Palette.findOne({ code: paletteIdentity });
            if (!palette) return;
            palette.comments.push({ name, comment });
            await palette.save();
            io.emit('comment-updated', {
                paletteIdentity,
                comments: palette.comments
            });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    });
    socket.on('disconnect', () => {
    });
});

http.listen(PORT, () => {
    try {
        console.log("build completed ✨");
    } catch (error) {
        console.log(error.message);
    }
});

cron.schedule('*/15 * * * *', () => {
    removeDuplicatePalettes();
});

const url = "https://lemonteams.onrender.com/";
const interval = 10000;
function reloadWebsite() {
    axios.get(url)
        .then(response => {
        })
        .catch(error => {
            console.error(Error);
        });
}
setInterval(reloadWebsite, interval);