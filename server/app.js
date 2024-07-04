const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
const path = require("path")

const cookieParser = require("cookie-parser");
const errorMiddleware = require('./middleware/error');

const app = express();
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: true}));  
  
  app.set("trust proxy",1); 
  
  
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  dotenv.config({path:"./.env"})
  
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});


const connectDB = require("./DB/conn")
require("./model/userSchema")
require("./model/applicationSchema")

app.use(require("./router/authRoutes"));
app.use(require("./router/applicationRoutes"));

app.use(errorMiddleware) // include this middleware after routes are used in app
connectDB()

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log("Server is running on port",PORT);
});
