const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userSchema");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncError( async (req, res, next) => {
  const { token  }  = req.cookies;
  
  if( !token ){
      return next(new ErrorHandler('Login first to handle this resource', 401))
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY)
  req.user = await User.findById(decoded.id)
  next();
})

exports.authorizeRoles = (...roles) => {
  return  (req, res, next) => {
       if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
       }
       next()
   }
}
