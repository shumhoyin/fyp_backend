const mongoose = require('mongoose')
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

//not finish
async function ShareLocation(req,res){

/*    //accept the message using form data format
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
    const upload = multer({storage : storage,limits: { fieldSize: 2 * 1024 * 1024 }}).single("file");

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
        // console.log(JSON.parse(req.body.data))*/





       // let locationInfo = JSON.parse(req.body.data);
        console.log(req.body)

    //tmp only
    let locationInfo = req.body;
        const {description , uploadedBy,latitude,longitude} = locationInfo;

        console.log(description);
        console.log(uploadedBy);

        let cleanedFormat = {
            type: 'Point',
                coordinates: [longitude,latitude]
        }

        delete locationInfo.description;
        delete locationInfo.latitude;
        delete locationInfo.longitude;




         let tmp1 = await new LocationDetail({
             description:description,
             uploadedBy:uploadedBy
         }).save();

        console.log(tmp1._id)
         console.log('finish save in LocationDetail');
         //this is default image only
         let imagePath = "http://localhost:3001/locationImg/test.jpg";
         locationInfo = {...locationInfo,
             locationDetail:tmp1._id,
             image:imagePath,
             location:cleanedFormat
         }
         console.log(locationInfo);
         let result = await new Location(locationInfo).save();

         if(result){
             res.json({
                 resCode: 1,
                 messgae: 'success',
                 payload: result,
             })
         }

}



async function GetLocation(req, res) {

        let {distance , type, latitude,longitude} = req.query;


    let Query = JSON.parse(JSON.stringify({
        location:{
            $near:{
                //maxdistance is in "meter"
                $maxDistance: distance,
                $geometry:{
                    type:'Point',
                    //this is the user location
                    coordinates: [longitude,latitude]
                }
            }
        },
        type:type
    }));

    Object.keys(Query).forEach(
        key=>{
            if(Query[key] === ''){
                delete Query[key];
            }
        }
    )
    console.log(JSON.stringify(Query))


        //if it is not a condition search
        //fetch all the place
        Location.find(Query).populate({path:"uploadedBy",select: '_id userName'}).lean().then(response=>{

            //return res with this format if success

            console.log(response)

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
        .populate({path:'locationDetail',populate:{path:'comments',populate:{path: 'uploadedBy',select: 'userName'}}}).lean()
        .then(response=>{
            //can find with this id
            //return res with this format if success

            const numOfLike = response.locationDetail.like.length
            const numOfDislike = response.locationDetail.dislike.length

            response.locationDetail.like = numOfLike;
            response.locationDetail.dislike = numOfDislike;
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


async function GiveLike(req,res){
    const {detailId , user_id} =req.body;
    // console.log(req.body)
    let result = await LocationDetail.findById(detailId).lean()

    let likeList = result.like;
    let dislikeList = result.dislike;

    // if the user already inside the  like list
    if(likeList.includes(user_id)) {
        console.log("have")
        res.json({
            resCode: 0,
            message: "already inside like",
            payload: "already inside like"
        })
    }else{
        // if the user not inside the like list
        console.log("doesnt have")

        //if user is inside the dislike list --> 1) remove the name inside the dislike list and 2) add to like list
        //else
        //1) add to like list

        if(dislikeList.includes(user_id)){
            //remove the name inside the dislike list
            await LocationDetail.findByIdAndUpdate(
                detailId,
                { $pull: { dislike: user_id } },
                { new: true, useFindAndModify: false }
            )


            //add the name inside the like list
            await LocationDetail.findByIdAndUpdate(
                detailId,
                { $push: { like: user_id } },
                { new: true, useFindAndModify: false }
            )

            //return new info to frontend
            let updatedInfo = await LocationDetail.findById(detailId).lean()

            const numOfLike = updatedInfo.like.length
            const numOfDislike = updatedInfo.dislike.length

            res.json({
                resCode: 1,
                message: "in dislike list and added to like list",
                payload: {
                    like: numOfLike,
                    dislike: numOfDislike
                }
            })


        }else{
            let result2 = await LocationDetail.findByIdAndUpdate(
                detailId,
                { $push: { like: user_id } },
                { new: true, useFindAndModify: false }
            )

            //return new info to frontend
            let updatedInfo = await LocationDetail.findById(detailId).lean()

            const numOfLike = updatedInfo.like.length
            const numOfDislike = updatedInfo.dislike.length

            res.json({
                resCode: 1,
                message: "not in dislike list and added to like list",
                payload: {
                    like: numOfLike,
                    dislike:numOfDislike

                }
            })
        }

    }


}


async function GiveDislike(req,res){
    const {detailId , user_id} = req.body;
    // console.log(req.body)
    let result = await LocationDetail.findById(detailId).select("like dislike -_id").lean()

    let likeList = result.like;
    let dislikeList = result.dislike;

    // if the user already inside the  like list
    if(dislikeList.includes(user_id)) {
        console.log("have")
        res.json({
            resCode: 0,
            message: "already inside dislike list",
            payload: "already inside dislike list"
        })
    }else{
        // if the user not inside the dislike list
        console.log("doesnt have")

        //if user is inside the dislike list --> 1) remove the name inside the dislike list and 2) add to like list
        //else
        //1) add to like list

        if(likeList.includes(user_id)){
            //remove the name inside the like list
            await LocationDetail.findByIdAndUpdate(
                detailId,
                { $pull: { like: user_id } },
                { new: true, useFindAndModify: false }
            )


            //add the name inside the dislike list
            await LocationDetail.findByIdAndUpdate(
                detailId,
                { $push: { dislike: user_id } },
                { new: true, useFindAndModify: false }
            )

            //return new info to frontend
            let updatedInfo = await LocationDetail.findById(detailId).lean()

            const numOfLike = updatedInfo.like.length
            const numOfDislike = updatedInfo.dislike.length

            res.json({
                resCode: 1,
                message: "in like list and added to dislike list",
                payload: {
                    like: numOfLike,
                    dislike: numOfDislike
                }
            })


        }else{
            let result2 = await LocationDetail.findByIdAndUpdate(
                detailId,
                { $push: { dislike: user_id } },
                { new: true, useFindAndModify: false }
            )

            //return new info to frontend
            let updatedInfo = await LocationDetail.findById(detailId).lean()

            const numOfLike = updatedInfo.like.length
            const numOfDislike = updatedInfo.dislike.length

            res.json({
                resCode: 1,
                message: "not in dislike list and added to dislike list",
                payload: {
                    like: numOfLike,
                    dislike:numOfDislike

                }
            })
        }

    }


}

//export module of Location
module.exports = { GetDetail,GiveComment,LocationHealthCheck,GetLocation,ShareLocation, GiveLike, GiveDislike};
