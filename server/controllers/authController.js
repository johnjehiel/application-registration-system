const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../model/userSchema");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const sendToken = require('../utils/jwt');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");
// const { ROLES } = require("../utils/Constants");

// new
const registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password, phone } = req.body

    if (!name) {
      return next(new ErrorHandler('Name field is empty', 400))
    }
    if (!email) {
      return next(new ErrorHandler('email field is empty', 400))
    }
    if (!password) {
      return next(new ErrorHandler('password field is empty', 400))
    }
    if (!phone) {
      return next(new ErrorHandler('phone field is empty', 400))
    }

    // const nameRegex = /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;
    const nameRegex = /^[a-zA-Z'.]+\s[a-zA-Z'.]+(?:\s[a-zA-Z'.]*){0,4}$/;

    if (!nameRegex.test(name)) {
      return next(new ErrorHandler('Kindly provide your complete name.', 400))
    }
    // Regular expression to validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
  
    if (!emailRegex.test(email)) {
      return next(new ErrorHandler('Kindly provide a valid email address.', 400))
    }

    if (phone.length !== 10) {
      return next(new ErrorHandler('Kindly enter a valid 10-digit phone number.', 400))
    }

    // Password length validation
    if (password.length < 7) {
      return next(new ErrorHandler('Password must contain at least 7 characters', 400))
    }
    
    const userWithName = await User.findOne({ name });
    if (userWithName) {
        return next(new ErrorHandler('name already exists', 400));
    }

    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
        return next(new ErrorHandler('email already exists', 400));
    }

    const userWithPhone = await User.findOne({ phone });
    if (userWithPhone) {
        return next(new ErrorHandler('phone number already exists', 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    sendToken(user, 201, res)

})

const loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} =  req.body

    if(!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    if (!email) {
      return next(new ErrorHandler('email field is empty', 400))
    }
    if (!password) {
      return next(new ErrorHandler('password field is empty', 400))
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
  
    if (!emailRegex.test(email)) {
      return next(new ErrorHandler('Kindly provide a valid email address.', 400))
    }

    // Password length validation
    if (password.length < 7) {
      return next(new ErrorHandler('Password must contain at least 7 characters', 400))
    }

    //finding the user database
    const user = await User.findOne({email}).select('+password');

    if(!user) {
      return next(new ErrorHandler('Invalid email or password', 401))
    }
    
    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 201, res)
    
})
  
const getdata = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json({
         success:true,
         user
    })
})


const logoutUser = (req, res, next) => {
    res.cookie('token',null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: "Loggedout"
    })

}

module.exports = { 
                  registerUser,
                  loginUser,
                  getdata,
                  logoutUser,
                };
