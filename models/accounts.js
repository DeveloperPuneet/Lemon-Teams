const mongoose = require("mongoose");
const date = Date.now();

const NotificationSchema = new mongoose.Schema({
    app: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: ""
    },
    identity: {
        type: String,
        default: ""
    },
    expire: {
        type: Date,
        default: () => date + 864000000 
    },
    time: {
        type: Date,  
        default: date
    }
});

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        required: true,
        unique: true
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
    link4: {
        type: String,
        default: ""
    },
    linkTitle4: {
        type: String,
        default: ""
    },
    pronounce: {
        type: String,
        default: "he/she"
    },
    notifications: {
        type: [NotificationSchema],
        default: []
    }
});

module.exports = mongoose.model('account', schema);
