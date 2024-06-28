const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../model/userSchema");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const sendToken = require('../utils/jwt');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");
const { ROLES } = require("../utils/Constants");

// old
const register = async (req, res,next) => {
  try {
    const { name, email,institution,department, phone, role,adminKey, password, cpassword } = req.body;
  // console.log(process.env.ADMIN_KEY);
  const hodExist = await User.findOne({ department , role: "hod" });

    if (role === ROLES.admin) {

      if (!name || !adminKey || !email || !phone || !role || !password || !cpassword) {
        return res.status(422).json({ error: "Kindly complete all fields." });
      }else if(adminKey !== process.env.ADMIN_KEY){
        return res.status(422).json({ error: "Provided Admin Key is Invalid." });
      }
    }else if(role === "hod"){
      if (!name || !institution || !department || !email || !phone || !role || !password || !cpassword) {
        return res.status(422).json({ error: "Kindly complete all fields." });
      }else if(hodExist){
        return res.status(422).json({ error: `Hod for ${department} already exists` });
      }
    }else{
      if (!name || !institution || !department || !email || !phone || !role || !password || !cpassword) {
        return res.status(422).json({ error: "Kindly complete all fields." });
      }
    }

   
    
    // Regular expression to validate full name with at least two words separated by a space
    const nameRegex = /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;
  
    if (!nameRegex.test(name)) {
      return res.status(422).json({ error: "Kindly provide your complete name." });
    }
    // Regular expression to validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
  
    if (!emailRegex.test(email)) {
      return res.status(422).json({ error: "Kindly provide a valid email address." });
    }
    
    const acropolisEmailRegex = /@acropolis\.in$/;
    const acropolisEduEmailRegex = /@acropolis\.edu\.in$/;

    // if (!acropolisEmailRegex.test(email) && !acropolisEduEmailRegex.test(email) ) {
    //   return res.status(422).json({ error: "Kindly provide a email address associated with Acropolis Institute" });
    // }
    // Phone validation
    if (phone.length !== 10) {
      return res.status(422).json({ error: "Kindly enter a valid 10-digit phone number." });
    }
  
    // Password length validation
    if (password.length < 7) {
      return res.status(422).json({ error: "Password must contain at least 7 characters" });
    }
  
    if (password !== cpassword) {
      return res.status(422).json({ error: "Password and confirm password do not match" });
    }
  
   
      
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(422).json({ error: "Provide email is associated with another account." });
      }
       else {
        let user
        if (role === ROLES.admin) {
           user = new User({ name, email, phone, role,adminKey,institution:"null",department:"null", password, cpassword });

        }else{
        
           user = new User({ name, email, phone, role,institution,department,adminKey:"null" ,password, cpassword });
        }
        // console.log(user);
        // Perform additional validation or data processing here
        await user.save();
  
        return res.status(201).json({ message: "Saved successfully" });
      }
    } catch (error) {
        next(error);
    }
  }

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

    const nameRegex = /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;
  
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

    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    sendToken(user, 201, res)

})

const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
       success:true,
       user
  })
})

  // transporter for sending email
  const transporter = nodemailer.createTransport({
    service:"gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
      user:process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD
    }
  })


  

  const resetPasswordTemplate = (resetLink,userName) => {
    return `
    
<head>
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<style>
  a,
  a:link,
  a:visited {
    text-decoration: none;
    color: #00788a;
  }

  a:hover {
    text-decoration: underline;
  }

  h2,
  h2 a,
  h2 a:visited,
  h3,
  h3 a,
  h3 a:visited,
  h4,
  h5,
  h6,
  .t_cht {
    color: #000 !important;
  }

  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td {
    line-height: 100%;
  }

  .ExternalClass {
    width: 100%;
  }
</style>
</head>

<body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
<table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">

  <tbody>
    <tr>
      <td style="padding: 50px; background-color: #fff; max-width: 660px">
        <table width="100%" style="">
          <tr>
            <td style="text-align:center">
              <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello ${userName}</h1>
              <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">A request has been received to change the password for your account</p>
              <a href="${resetLink}"  style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">Reset Password </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td style="text-align: center; padding-top: 30px">
        <table>
          <tr>
              <td>
            <td style="text-align: left;color:#B6B6B6; font-size: 18px; padding-left: 12px">If you didn’t request this, you can ignore this email or let us know. Your password won’t change until you create a new password.</td>
      </td>
    </tr>
</table>

</td>
</tr>
</tfoot>
</table>
</body>



    `;
  };






  
  const verifyEmailTemplate = (resetLink,userFind) => {
    return `
    

    <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <style>
      a,
      a:link,
      a:visited {
        text-decoration: none;
        color: #00788a;
      }
    
      a:hover {
        text-decoration: underline;
      }
    
      h2,
      h2 a,
      h2 a:visited,
      h3,
      h3 a,
      h3 a:visited,
      h4,
      h5,
      h6,
      .t_cht {
        color: #000 !important;
      }
    
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td {
        line-height: 100%;
      }
    
      .ExternalClass {
        width: 100%;
      }
    </style>
    </head>
    
    <body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
    <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">

      <tbody>
      <tr>
        <td style="padding: 50px; background-color: #fff; max-width: 660px">
          <table width="100%" style="">
            <tr>
              <td style="text-align:center">
                <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello Admin</h1>
                <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">A new user has registered on our platform. Please review the user's details provided below and click the button below to verify the user.</p>
                 <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">User Details</h1>
                <div style="text-align: justify; margin:20px; display: flex;">
                  
                  <div style="flex: 1; margin-right: 20px;">
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Full Name :</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Email :</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Phone :</h1>
                         <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Profession :</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Institution :</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Department :</h1>
                  </div>
                  <div style="flex: 1;">
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.name}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.email}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.phone}</h1>
                         <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.role}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.institution}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.department}</h1>
                  </div>
                </div>
                
                <a href="${resetLink}" style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">Verify User</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </tbody>

    </table>
    </body>


    `;
  };

const passwordLink = async (req, res,next) => {
  // console.log(req.body);
  // res.json({message:"login success"})
  try {

    const { email } = req.body;
    if (!email ) {
      return res.status(400).json({ error: "Please Enter yout Email" });
    }

    const userFind = await User.findOne({ email });

    if (userFind) {
        const token = jwt.sign({_id:userFind._id},process.env.SECRET_KEY,{
          expiresIn:"300s"
        })
        
        const setUserToken = await User.findByIdAndUpdate({_id:userFind._id},{verifyToken:token},{new:true})
        

        if (setUserToken) {
          const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Book It Reset Password",
            html:resetPasswordTemplate((`${process.env.CLIENT_URL}/forgotPassword/${userFind.id}/${setUserToken.verifyToken}`),userFind.name)
            // text:`This link is valid for 5 minutes \n ${process.env.CLIENT_URL}/forgotPassword/${userFind.id}/${setUserToken.verifyToken} \n click on above link`
          }
        
          transporter.sendMail(mailOptions,(error,info)=>
          {
            if (error) {
              console.log(error);
              res.status(401).json({status:401,message:"Email not Send"})
            }else{
              console.log("Email Sent ",info.response);
              res.status(201).json({status:201,message:"Email Send Successfully"})
            }
          })
        }
        // console.log(setUserToken);

    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(401).json({status:401,message:"Invalid User"})
      next(error);
  }
}



const forgotPassword = async (req, res,next) => {
  const {id,token} = req.params
  try {
    const validUser = await User.findOne({_id:id,verifyToken:token})

      const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

      if (validUser && verifyToken._id) {
        res.status(201).json({status:201,validUser})
      }else{
        res.status(401).json({status:401,message:"user not exist"})
      }

  //  // console.log(validUser); 
  } catch (error) {
    res.status(401).json({status:401,error})
    
  }
   
  
}


const setNewPassword = async (req, res,next) => {
  const {id,token} = req.params
  const {password,cpassword} = req.body
  
  try {
    if (password.length < 7) {
      return res.status(422).json({ error: "Password must contain at least 7 characters" });
    }
  
    if (password !== cpassword) {
      return res.status(422).json({ error: "Password and confirm password do not match" });
    }

    const validUser = await User.findOne({_id:id,verifyToken:token})

      const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

      if (validUser && verifyToken._id) {

        
        const newPassword =await  bcrypt.hash(password,12)
        const setnewPassword = await User.findByIdAndUpdate({_id:id},{password:newPassword})

        setnewPassword.save()

        res.status(201).json({status:201,setnewPassword})
      }else{
        res.status(401).json({status:401,message:"user not exist"})
      }

  //  // console.log(validUser); 
  } catch (error) {
    res.status(401).json({status:401,error})
    
  }
   
  
}











const emailVerificationLink = async (req, res,next) => {
  // console.log(req.body);
  // res.json({message:"login success"})
  try {

    const { email } = req.body;

    if (!email ) {
      return res.status(400).json({ error: "Please Enter yout Email" });
    }

    const userFind = await User.findOne({ email });

    if (userFind) {
        const token = jwt.sign({_id:userFind._id},process.env.SECRET_KEY,{
          expiresIn:"1d"
        })
        
        const setUserToken = await User.findByIdAndUpdate({_id:userFind._id},{verifyToken:token},{new:true})
        

        if (setUserToken) {
          const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            //send mail to admin to verify new user
            // to:process.env.ADMIN_EMAIL,
            subject:"Book It User Verification",
            html:verifyEmailTemplate((`${process.env.CLIENT_URL}/verifyEmail/${userFind.id}/${setUserToken.verifyToken}`),userFind) 
            // text:`This link is valid for 5 minutes \n ${process.env.CLIENT_URL}/forgotPassword/${userFind.id}/${setUserToken.verifyToken} \n click on above link`
          }
        
          transporter.sendMail(mailOptions,(error,info)=>
          {
            if (error) {
              console.log(error);
              res.status(401).json({status:401,message:"Email not Send"})
            }else{
              console.log("Email Sent ",info.response);
              res.status(201).json({status:201,message:"Email Send Successfully"})
            }
          })
        }



        // console.log(setUserToken);

    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(401).json({status:401,message:"Invalid User"})
      next(error);
  }
}





const verifyEmail = async (req, res,next) => {
  const {id,token} = req.params
  try {
      
    const validUser = await User.findOne({_id:id,verifyToken:token})

    const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

      if (validUser && verifyToken._id) {
        const setUserToken = await User.findByIdAndUpdate({_id:validUser._id},{emailVerified:true})
        setUserToken.save()
        res.status(201).json({status:201,validUser,message:"Verify successfully"})
      }
      else{
        res.status(401).json({status:401,error:"user not exist"})
      }
      // console.log(setUserToken);
    
     
  //  // console.log(validUser); 
  } catch (error) {
    // res.status(401).json({status:422,error})
    next(error);

  }
}







// const login = async (req, res,next) => {
//     // console.log(req.body);
    
//     // res.json({message:"login success"})
//     try {
//       let token;
//       const { email, password } = req.body;
//       if (!email || !password) {
//         return res.status(400).json({ error: "Kindly complete all fields." });
//       }
  
//       const userLogin = await User.findOne({ email });
  
//       if (userLogin) {
//         const isMatch = await bcrypt.compare(password, userLogin.password);
//         token = await userLogin.generateAuthToken();
//         // console.log("this is login token" + token);

//         // res.cookie("jwtoken", token, {
//         //   maxAge: 900000,
//         //   // expires: new Date(Date.now() + 9000000),
//         //   path :"/",
          
//         //   // domain:".onrender.com",
//         //   // expires: new Date(Date.now() + 900),
          
//         //   httpOnly: true,
//         // })

//         // window.sessionStorage.setItem("jwtoken", data.token);
       
//         if (!isMatch) {
//           res.status(400).json({ error: "Invalid Credentials" });
//         } else {
//           console.log(userLogin);
//           res.status(200).json({ userLogin, token: token, message: "User logged in successfully" });
//           // res.status(200)
//           // .send(userLogin).json({ message: "user login successfully" })
//         }
//       } else {
//         res.status(400).json({ error: "Invalid Credentials" });
//       }
      
//     } catch (error) {
//         next(error);
//     }
//   }

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

  const about = async (req, res) => {
    // console.log("about page");
    res.send(req.user);
  }
  
  //get user data for contact us and home page
  const getdata = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json({
         success:true,
         user
    })
 })





  const contact = async (req, res,next) => {
    try {
      const { name, email,department, phone, message } = req.body;
  
      if (!name || !department || !email || !phone || !message) {
        // console.log("error in contact form");
        return res.json({ error: "Plz fill form correctly" });
      }
  
  const userContact = await  User.findOne({_id:req.userID})
  
  if (userContact){
    // console.log("user find");
  
    const userMessage = await userContact.addMessage(name,email,phone,message)
    await userContact.save();
  
    res.status(201).json({message:"message created"})
  
  }
  
    } catch (error) {
        next(error);
    }
  }
  
  

  
  // const logout = async (req, res, next) => {
  //   // const userId = req.userId; // get the userId from the request header
  //   try {
  //     const userId = req.params.userId;
  //     // remove the user token from the database
  //     const user = await User.findByIdAndUpdate(
  //       {_id: userId},
  //       { $unset: { tokens: 1 } },
  //       { new: true }
  //     );
  
  //     // clear the cookie
  //     // res.clearCookie("jwtoken",{path:"/"});

  
  //     res.status(200).send("User logged out successfully");
  //   } catch (error) {
  //     next(error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }
  
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
                  // register, 
                  registerUser,
                  // login,
                  loginUser, 
                  about, 
                  getdata, 
                  contact,
                  // logout,
                  logoutUser,
                  passwordLink,
                  forgotPassword,
                  setNewPassword,
                  emailVerificationLink,
                  verifyEmail};
