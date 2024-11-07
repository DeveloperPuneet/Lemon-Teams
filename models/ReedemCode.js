const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    redeemed_by: {
        type: Array,
        default: []
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("ReedemCode", schema);