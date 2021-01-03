const Location = require("../models/location.model");
const LocationDetail = require("../models/locationDetail.model")
const Comments = require("../models/comment.model")


async function LocationHealthCheck(req, res) {
    try {

        console.log("inside User.controller");

        //return res with this format if succes
        return res.json({
            resCode: 1,
            msg: "success",
            payload: "",
        });
    } catch (e) {
        //return res with this format if fail
        console.log(e);
        return res.json({
            resCode: 0,
            msg: "fail",
            payload: "",
        });
    }
}

async function ShareLocation(req,res){
    console.log(req.body);
    const {description , uploadedBy} = req.body
    console.log(description);
    console.log(uploadedBy);
    let locationInfo = req.body;
    delete locationInfo.description;

    let tmp1 = await new LocationDetail({
        description:description,
        uploadedBy:uploadedBy
    }).save();

    console.log(tmp1)
    console.log('finish save in LocationDetail');
    locationInfo = {...locationInfo,locationDetail:tmp1._id}
    console.log(locationInfo);
   let result = await new Location(locationInfo).save();
    res.json({
        resCode: 1,
        messgae: 'success',
        payload: result,
    })


}



async function GetLocation(req, res) {
    let result = '';
    await Location.find().populate("uploadedBy").then(res=>{
    result  = res;
        });

    // title: 'Curry',
    //     latitude: 37.79489,
    //     longitude: -122.4596065,
    //     image: require('../../assets/images/samplephoto/testphoto5.jpg'),



    //return res with this format if success
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({
        resCode: 1,
        msg: "success",
        payload: result
    })

}

//export module of Location
module.exports = { LocationHealthCheck,GetLocation,ShareLocation};
