const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  role: {
    type: String,
    enum: ['applicant', 'reviewer', 'admin'],
    default: 'applicant'
  },
  password: {
    type: String,
    require: true,
  },
  emailVerified:{
    type:Boolean,
    default: false
  },
  phoneVerified: {
    type:Boolean,
    default: false
  }
  },
  {
    timestamps: true
  }
);

// yaha per password hashing ker rahe hai

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 12);
//     this.cpassword = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

// // generating jwt token

// userSchema.methods.generateAuthToken = async function () {
//   try {
//     let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '2d' });
//     this.tokens = this.tokens.concat({ token: token });
//     await this.save();
//     return token;
//   } catch (error) {
//     // console.log(error);
//   }
// };

// new

userSchema.pre('save', async function (next){
  if(!this.isModified('password')){
      next();
  }
  this.password  = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function(){
 return jwt.sign({id: this.id}, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_TIME
  })
}

userSchema.methods.isValidPassword = async function(enteredPassword){
  return  bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetToken = function(){
  //Generate Token
  const token = crypto.randomBytes(20).toString('hex');

  //Generate Hash and set to resetPasswordToken
 this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');

 //Set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token
}

const User = new mongoose.model("tempuser", userSchema);

module.exports = User;
