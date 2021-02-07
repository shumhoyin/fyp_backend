const User = require("../models/user.model");


async function UserHealthCheck(req, res) {
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

async function UserRegister(req, res) {
  console.log(req.body);

  try {
    let userModel = new User(req.body);
    await userModel.save();
    console.log("rescode = " + res.statusCode);
    //return res with this format if succes
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({
      resCode: 1,
      msg: "success",
      payload: userModel,
    });
  } catch (err){
    console.log(err.message);
    let valErrors = [];
// Object.keys(err.errors).forEach(key=>valErrors.push(err.errors[key].message));
console.log(valErrors);
res.setHeader('Access-Control-Allow-Origin', '*');
      return res.json({
        resCode: 0,
        msg: "fail",
        payload:valErrors
      });
  }
}

//GetUser is a function for login
//trying
async function GetUser(req, res) {
  const { userName, userPassword } = req.body;
  console.log(req.body);

  try {
    //Checking the database for the user
    User.findOne({'userName':userName,'userPassword':userPassword},function(err,user){

      //if cannot find the user
      if(err || !user){
        console.log("Incorrect Username or Password");
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json({
          resCode: 0,
          msg: "fail",
          payload:err
        });
      }

      //if user found
      if (user){
        console.log("登入成功！");

        let data = {
          _id:user._id,
          firstName : user.firstName,
          lastName: user.lastName,
          userName:user.userName,
          email: user.email,
          createdAt: user.createdAt
        }

        //return res with this format if succes
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json({
          resCode: 1,
          msg: "success",
          payload: data,
        });


      }

    });


  } catch (err){
    //related to connection error
    console.log(err.message);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({
      resCode: 0,
      msg: "fail",
      payload:valErrors
    });
  }
}

async function AddToFavouriteList(req,res){
  console.log(req.body)

  const {user_id, location_id} = req.body;

    User.findByIdAndUpdate(
        user_id,
        { $push: { favouriteList: location_id } },
        { new: true, useFindAndModify: false }
    ).then((res) => {
      console.log(res);
    });

}


async function GetUserFavouriteList(req,res) {
  const tarId = req.query.user_id;

  let result  = await User.findById(tarId).populate({path:'favouriteList',populate:{path:'uploadedBy locationDetail',select:'-userPassword'}}).lean()
  result = result.favouriteList;

  for (const obj in result){
    console.log(result[obj])
    Object.keys(result[obj].locationDetail).forEach(
        key=>{
          if(key ==='like' || key==="dislike"){
            console.log(result[obj].locationDetail[key]);
            let num = result[obj].locationDetail[key].length;
            result[obj].locationDetail[key] = num;
          }
        }
    )
  }

  console.log(result)

  res.send({
    resCode:1,
    message:"success",
    payload:result
  })

}



//export module of User
module.exports = { UserHealthCheck, UserRegister ,GetUser,AddToFavouriteList,GetUserFavouriteList};
