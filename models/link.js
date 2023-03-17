const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    roomName: {
        type: String,
        required: true,
    },
    userId : {
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    isJoined: {
        type: Boolean,
        default: false,
    },

},{timestamps: true});

module.exports = mongoose.model("Link", linkSchema);
