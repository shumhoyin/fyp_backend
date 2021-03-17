const User = require("../models/user.model");
const bcrypt = require('bcrypt')
var saltRound = 10;

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


  try {
    let userObject = req.body;
    let { userPassword } = userObject;

    let hashedPassword = await bcrypt.hash(userPassword,saltRound);
    let userModel = await new User({...userObject,userPassword: hashedPassword}).save();

    //return res with this format if success
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({
      resCode: 1,
      msg: "Register Success",
      payload: userModel,
    });

  } catch (err){
    //handle 2 kinds of error
    if(err.name === 'ValidationError') return err = handleValidationError(err, res);
    if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
  }
}

//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const error = `An account with that ${field} already exists.`;
  res.send({resCode:0 , msg: error,payload:'' });
}
//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map(el => el.message);
  let fields = Object.values(err.errors).map(el => el.path);
  if (errors.length > 1) {
    const formattedErrors = errors.join('\n');
    res.send({resCode:0,msg: formattedErrors, payload: fields});
    } else {
    const formattedErrors = errors.join('');
    res.send({resCode:0,msg: formattedErrors, payload: fields})
    }

}

//GetUser is a function for login
//trying
async function GetUser(req, res) {
  const {userName, userPassword} = req.body;
  console.log({userName, userPassword})


  //Checking the database for the user
  let result = await User.findOne({'userName': userName}).lean()
  //if user found
  if (result) {
    //check if the password is same
    const match = await bcrypt.compare(userPassword, result.userPassword);
    console.log({userName, userPassword})
    console.log(match)

    if (match) {
      console.log("登入成功！");
      let data = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        userName: result.userName,
        email: result.email,
        createdAt: result.createdAt,
        userIcon: result.userIcon
      }
      //return res with this format if succes
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.json({
        resCode: 1,
        msg: "success",
        payload: data,
      });
    } else {
      console.log("Incorrect Username or Password");
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.json({
        resCode: 0,
        msg: "fail",
        payload: "Incorrect Username or Password"
      });
    }
  }else{
    console.log("Incorrect Username or Password");
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({
      resCode: 0,
      msg: "Incorrect Username or Password",
      payload: ""
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

async function ChangeUserIcon(req,res) {
  const {userid , IconPath} = req.body;

  let response = await User.findByIdAndUpdate(
      userid,
      {userIcon: IconPath},
      { new: true}
  ).lean()

  if (response){
    let data = {
      _id:response._id,
      firstName : response.firstName,
      lastName: response.lastName,
      userName:response.userName,
      email: response.email,
      createdAt: response.createdAt,
      userIcon:response.userIcon
    }

    res.send({
      resCode:1,
      message:"success",
      payload: data
    })

  }

}

async function ChangeUserProfile(req,res){
  console.log(req.body);

  const {_id,userIcon, firstName,lastName,userName,email,newUserPassword} = req.body;

  if(newUserPassword !== undefined || newUserPassword === '' ){
      let userPassword = await bcrypt.hash(newUserPassword,saltRound);
      let updatedAt = Date.now()

      let Query = {userIcon, firstName,lastName,userName,email,userPassword,updatedAt}

      Object.keys(Query).forEach(
          key=>{
            if(Query[key] === ''){
              delete Query[key];
            }
          }
      )

      let response = await User.findByIdAndUpdate(
          _id,
          Query,
          { new: true,select:"_id userIcon firstName lastName userName email"}
      ).lean()

      console.log(response)

      res.send({
        resCode:1,
        message:"success",
        payload: response
      })


  }else{

    //change without password

      let updatedAt = Date.now()

      let Query = {userIcon, firstName,lastName,userName,email,updatedAt}

      Object.keys(Query).forEach(
          key=>{
            if(Query[key] === ''){
              delete Query[key];
            }
          }
      )

      let response = await User.findByIdAndUpdate(
          _id,
          Query,
          { new: true,useFindAndModify:true,select:"_id userIcon firstName lastName userName email"}
      ).lean()

      console.log(response)

      res.send({
        resCode:1,
        message:"success",
        payload: response
      })

  }



}


//export module of User
module.exports = { UserHealthCheck, UserRegister ,GetUser,AddToFavouriteList,GetUserFavouriteList,ChangeUserIcon,ChangeUserProfile};
