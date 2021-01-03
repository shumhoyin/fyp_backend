const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    //for stating user name
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_infos",
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
},);

module.exports = mongoose.model("comments", CommentSchema);
