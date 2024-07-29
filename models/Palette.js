const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tags: {
        type: String
    },
    publishing_date: {
        type: String,
        required: true,
        default: Date()
    },
    identity: {
        type: String,
        require: true
    },
    color1: {
        type: String
    },
    color2: {
        type: String
    },
    color3: {
        type: String
    },
    color4: {
        type: String
    },
    color5: {
        type: String
    },
    color6: {
        type: String
    },
    color7: {
        type: String
    },
    color8: {
        type: String
    },
    color9: {
        type: String
    },
    color10: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    code: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Palette', schema);