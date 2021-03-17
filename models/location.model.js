const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({

    locationName: {
        type: String,
        required: true,
    },
    location:{
        //this is the data type of the location field
        type:{
            type:String,
            enum:['Point'],
            required:true,
            default: 'Point'
        },
        coordinates:{
            //coord will be an array [long , lag]
            type:[Number],
            required:true
        },

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
    keyword:{
        type:Array
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
LocationSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('locations', LocationSchema);
