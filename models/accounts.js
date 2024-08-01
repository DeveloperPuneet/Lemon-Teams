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
    },
    description: {
        type: String,
        default: "I love lemons"
    },
    link1: {
        type: String,
        default: ""
    },
    linkTitle1: {
        type: String,
        default: ""
    },
    link2: {
        type: String,
        default: ""
    },
    linkTitle2: {
        type: String,
        default: ""
    },
    link3: {
        type: String,
        default: ""
    },
    linkTitle3: {
        type: String,
        default: ""
    },
    link4:{
        type:String,
        default: ""
    },
    linkTitle4:{
        type:String,
        default: ""
    },
    pronounce:{
        type:String,
        default: "he/she"
    }
});

module.exports = mongoose.model('account', schema);