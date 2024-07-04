const mongoose = require("mongoose");

const DB = process.env.DATABASE;
mongoose.set('strictQuery', false)

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // usefindOneAndUpdate: false, // Use findOneAndUpdate() instead
      // useCreateIndex: true // Use createIndex() instead
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    // console.log(error)
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
