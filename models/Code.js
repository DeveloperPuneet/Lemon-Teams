const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    version: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model("Code", schema);