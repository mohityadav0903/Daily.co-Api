const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true
    },
    links: [
        {
            linkNo: {
                type: String,
                required: true,
            },
            token: {
                type: String,
                required: true,
            },
            isJoined: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
    ],
   

},{timestamps: true});

module.exports = mongoose.model("Link", linkSchema);
