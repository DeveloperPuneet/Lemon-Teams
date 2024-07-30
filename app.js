const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cron = require('node-cron');
const { removeDuplicatePalettes } = require('./controllers/paletteController');

const config = require("./config/config");
const router = require("./routes/router");

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

io.on("connection", (socket) => {

    socket.on("disconnect", () => {

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
    console.log('Running duplicate palette removal task');
    removeDuplicatePalettes();
});

const url = "https://lemonteams.onrender.com/"; 
const interval = 10000; 
function reloadWebsite() {
  axios.get(url)
    .then(response => {
    })
    .catch(error=>{
      console.error(Error);
    });
}
setInterval(reloadWebsite, interval);