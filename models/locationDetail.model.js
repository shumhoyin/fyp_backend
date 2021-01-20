const mongoose = require("mongoose");

const LocationDetailSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    like: [
        {
            type: String,
            unique:true
        }
    ],
    dislike: [
        {
            type: String,
            unique:true
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comments',
        }
    ],
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user_infos',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("location_details", LocationDetailSchema);
