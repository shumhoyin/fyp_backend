const express = require("express");

const mongoose = require("mongoose");

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
  const { username, hashedPassword } = req.body;
  console.log('inside get user');

  try {
    //Checking the database for the user
    User.findOne({'username':username,userPassword:userPassword},function(err,user){

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

        //return res with this format if succes
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json({
          resCode: 1,
          msg: "success",
          payload: '',
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

//export module of User
module.exports = { UserHealthCheck, UserRegister ,GetUser};
