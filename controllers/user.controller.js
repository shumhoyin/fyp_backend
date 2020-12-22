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
  const { email, username, hashedPassword, firstName, lastName } = req.body;

  let user = {};
  user.username = username;
  user.email = email;
  user.hashedPassword = hashedPassword;
  user.firstName = firstName;
  user.lastName = lastName;

  console.log(user);

  try {
    let userModel = new User(user);
    await userModel.save();
    console.log("rescode = " + res.resCode);
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

//export module of User
module.exports = { UserHealthCheck, UserRegister };
