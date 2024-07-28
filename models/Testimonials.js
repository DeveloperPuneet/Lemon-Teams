const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Testimonials: {
        type: String,
        required: true
    },
    publishing_date: {
        type: String,
        required: true,
        default: Date()
    },
    identity:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Testimonials', schema);