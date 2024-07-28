const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    profile: {
        type: String,
        default: "default.png"
    },
    token: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('account', schema);