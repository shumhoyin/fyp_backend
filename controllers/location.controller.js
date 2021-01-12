const Location = require("../models/location.model");
const LocationDetail = require("../models/locationDetail.model")
const Comments = require("../models/comment.model")

const multer = require("multer")
const fs = require("fs")


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

    //accept the message using form data format
    //config of local storage
    const storage = multer.diskStorage({
        //storage location path
        destination: (req,file,callback)=>{
            callback(null,'public/locationImg')
        },
        //the fomatted filename
        filename:(req,file,callback)=>{
            callback(null,Date.now()+'_'+ file.originalname)
        }
    })

    //only accept single file with "file" header
    const upload = multer({storage : storage}).single("file");

    //upload method that accept the data in formdata header
    upload(req,res,(err)=>{
        //if faced error, return err
        if(err){
            res.json({
                resCode: 0,
                messgae: 'failure',
                payload: err.message
            })
        }
        console.log(req.body.file)
        console.log(JSON.parse(req.body.data))


        //if no error do the following stuff


        // let locationInfo = JSON.parse(req.body.data);
        //
        // const {description , uploadedBy} = locationInfo;
        // console.log(description);
        // console.log(uploadedBy);
        // console.log(locationInfo);
        // delete locationInfo.description;
        //
        //
        //  let tmp1 = new LocationDetail({
        //      description:description,
        //      uploadedBy:uploadedBy
        //  }).save();
        //
        //  console.log(tmp1)
        //  console.log('finish save in LocationDetail');
        //  let imagePath = "http://localhost:3001/public/locationImg/" + req.file.filename;
        //  locationInfo = {...locationInfo,locationDetail:tmp1._id,image:imagePath}
        //  console.log(locationInfo);
        //  let result = new Location(locationInfo).save();
        //  res.json({
        //      resCode: 1,
        //      messgae: 'success',
        //      payload: result,
        //  })


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
    const tarId = req.query.LocationId;

    Location.findById(tarId).populate({path:'uploadedBy',select:'userName'})
        .populate({path:'locationDetail',populate:{path:'comments',populate:{path: 'uploadedBy',select: 'userName'}}})
        .then(response=>{
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
