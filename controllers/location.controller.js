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

    Location.find().populate("uploadedBy").then(response=>{

        //return res with this format if success
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json({
            resCode: 1,
            msg: "success",
            payload: response
        })
        });



}


async function GiveComment(req, res) {
    console.log(req.body)
    const {detailId,data, uploadedBy} = req.body;

    const configed = {
        uploadedBy:uploadedBy,
        content:data,
    }


    new Comments(configed).save().then((res) => {
        LocationDetail.findByIdAndUpdate(
            detailId,
            { $push: { comments: res._id } },
            { new: true, useFindAndModify: false }
        ).then((res) => {
            console.log("123");
        });
    });

    //return res with this format if success
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({
        resCode: 1,
        msg: "success",
        payload: ''
    })

}

async function GetDetail(req, res){

    LocationDetail.findById("5ff1a6cfc9a1442dd83350f7").populate('comments').then(response=>{
            //can find with this id
            //return res with this format if success
            console.log(response);
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.json({
                resCode: 1,
                msg: "success",
                payload: response
            })


        })
        .catch(err=>{
            //cannot find with this id
            console.log()
        })


}



//export module of Location
module.exports = { GetDetail,GiveComment,LocationHealthCheck,GetLocation,ShareLocation};
