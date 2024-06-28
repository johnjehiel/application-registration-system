const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userSchema");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

//old
exports.authenticate = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    const verifyTokens = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({
      _id: verifyTokens._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("user not found");}
      
      req.token = token;

      req.user = user;
      req.userID = user._id;
      next();
    
  } catch (error) {
    console.log(error);
    res.status(401).send("unauthorized:No token provided");
  }
};
// new
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



// module.exports = Authenticate;
