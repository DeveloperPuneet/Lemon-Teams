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
    sorting_date: {
        type: Number,
        default: Date.now()
    },
    views: {
        type: Number,
        default: 0
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    identity: {
        type: String,
        required: true
    },
    library: {
        type: Array,
        default: []
    },
    saved: {
        type: Array,
        default: []
    },
    LTS_version: {
        type: Number,
        default: 0
    },
    receiver_token: {
        type: String,
        sparse: true 
    }
});

module.exports = mongoose.model('Library', schema);