const express = require("express");
const mongoose = require("mongoose");

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