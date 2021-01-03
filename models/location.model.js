const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({

    locationName: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    type:{
        type:String,
        required:true
    },
    image: {
        type: String,
        required: true,
        default: "http://localhost:3001/locationImg/test.jpg",
    },
    uploadedBy:{
        type: mongoose.Schema.Types.ObjectID,
        ref:'user_infos',
        required: true

    },
    locationDetail:{
        type: mongoose.Schema.Types.ObjectID,
        ref:'location_details',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('locations', LocationSchema);
