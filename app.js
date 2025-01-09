//! जय श्री कृष्ण
/* These lines of code are importing necessary modules in a Node.js application: */
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cron = require('node-cron');

/* These lines of code are importing necessary modules and dependencies in a Node.js application. */
const { sendTopPalettesEmail, removeDuplicatePalettes, deleteIdenticalColorPalettes, removeInvalidHexPalettes } = require('./controllers/paletteController');
const config = require("./config/config");
const router = require("./routes/router");
const Palette = require("./models/Palette");
const Library = require("./models/Library");
const accounts = require("./models/accounts");

/* These lines of code are setting up a Node.js server using Express framework and Socket.io for
real-time communication. Here's what each line is doing: */
const app = express();
const PORT = config.port;
const http = require("http").Server(app);
const io = require("socket.io")(http);

/**
 * The function `database` attempts to establish a connection to a database using mongoose, and if it
 * fails, it retries after a delay of 600 seconds.
 */
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

// socket.io stuff
/* This block of code is handling various socket events within a Node.js application using Socket.io.
Here's a breakdown of what each socket event is doing: */
io.on('connection', (socket) => {

    socket.on('toggle-like', async (data) => {
        try {
            const palette = await Palette.findOne({ code: data.paletteIdentity });
            const user = await accounts.findOne({ identity: palette.identity });
            if (palette) {
                if (palette.liked.includes(data.userId)) {
                    palette.liked.pull(data.userId);
                    if (user.coin >= 1) {
                        const coin = user.coin - 2;
                        await accounts.updateOne({ identity: user.identity }, { $set: { coin: coin } });
                        user.notifications.push({
                            app: "Team loss",
                            comment: '',
                            name: "2",
                            link: data.paletteIdentity,
                            identity: data.userId,
                        });
                        await user.save();
                    }
                } else {
                    palette.liked.push(data.userId);
                    const liker = await accounts.findOne({ identity: data.userId });
                    let coin = user.coin + 2
                    await accounts.updateOne({ identity: user.identity }, { $set: { coin: coin } });
                    user.notifications.push({
                        app: "Color Lab",
                        comment: '',
                        name: liker.name,
                        link: data.paletteIdentity,
                        identity: data.userId,
                    });
                    user.notifications.push({
                        app: "Team won",
                        comment: '',
                        name: "2",
                        link: data.paletteIdentity,
                        identity: data.userId,
                    });
                    await user.save();
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
                const user = await accounts.findOne({ identity: data.userId });
                const owner = await accounts.findOne({ identity: palette.identity });
                let coin = owner.coin + 10;
                await accounts.updateOne({ identity: palette.identity }, { $set: { coin: coin } });
                owner.notifications.push({
                    app: "Color Lab",
                    comment: data.comment,
                    name: user.name,
                    link: data.paletteIdentity,
                    identity: data.userId,
                });
                await owner.save();
                await palette.save();
                io.emit('comment-updated', { paletteIdentity: data.paletteIdentity, comments: palette.comments });
            }
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on("purchase-palette", async ({ userId, paletteIdentity }) => {
        try {
            let message;
            const user = await accounts.findOne({ identity: userId });
            const palette = await Palette.findOne({ code: paletteIdentity });
            let getCurrentTime = () => {
                return Date.now();
            };
            let date = getCurrentTime() + 2592000000;
            if (user.coin >= 1200 && palette.sponser == false) {
                palette.sponser = true;
                palette.sponser_expires = date;
                await palette.save();
                await accounts.updateOne({ identity: user.identity }, { coin: user.coin - 1200 });
                message = "Your Palette has been Sponsered successfully 😚";
            } else if (palette.sponser == true) {
                message = "Your Palette is already Sponsered 😚";
            } else {
                message = "Not enough Coins 😿";
            }
            socket.emit("purchase-progress", { message });
        } catch (error) {
            console.error(error.message);
        }
    })

    socket.on('toggle-save', async ({ userId, libraryCode }) => {
        try {
            const library = await Library.findOne({ code: libraryCode });
            if (library) {
                const userIndex = library.saved.indexOf(userId);
                if (userIndex === -1) {
                    library.saved.push(userId);
                    io.emit('save-updated', { libraryCode, saved: true });
                    const user = await accounts.findOne({ identity: userId });
                    const owner = await accounts.findOne({ identity: library.identity });
                    owner.notifications.push({
                        app: "Library",
                        name: user.name,
                        link: libraryCode,
                        identity: userId,
                    });
                    await owner.save();
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

    socket.on("buyBadge", async (data) => {
        try {
            let user = await accounts.findOne({ identity: data.userId });
            if (user.coin >= data.cost && !user.badges.includes(data.title)) {
                user.coin -= data.cost;
                user.badges.push(data.title);
                await user.save();
                socket.emit("badge-purchased", { message: "Badge Purchased successfully 🥰" });
            } else if (user.coin <= data.cost) {
                socket.emit("badge-purchased", { message: "Don't have enough coins 😿" });
            } else if (user.badges.includes(data.title)) {
                socket.emit("badge-purchased", { message: "You already own this badge 🤪" });
            } else {
                socket.emit("badge-purchased", { message: "Not enough coins 😭" });
            }
        } catch (error) {
            console.log(error.message);
        }
    });

    socket.on("coin-update", async (data) => {
        let user = data.user;
        const account = await accounts.findOne({ identity: user });
        let coin = account.coin;
        socket.emit("coin-update", { coin });
    });

    socket.on("notification-seen", async (data) => {
        try {
            let identity = data.user;
            let info = await accounts.updateOne(
                { identity: identity },
                { $set: { "notifications.$[].seen": true } }
            );
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect', () => {
    });
});

/* This is starting the Node.js server to listen on a specific port defined by `PORT`. When a client
makes a request to the server, it will handle the request and respond accordingly. Additionally, the
callback function inside `http.listen` is logging a message "build completed ✨" to the console once
the server is successfully started. */
http.listen(PORT, () => {
    console.log("build completed ✨");
});

cron.schedule('*/15 * * * *', () => {
    removeDuplicatePalettes();
    deleteIdenticalColorPalettes();
    removeInvalidHexPalettes();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

async function visitWebsite() {
    try {
        await axios.get('https://lemonteams.onrender.com');
    } catch (error) {
    }
}

visitWebsite();
setInterval(visitWebsite, 15 * 60 * 1000);
