const express = require("express");
const router = express.Router();

// const cookieParser = require("cookie-parser");
const authController = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/authenticate')

require("../DB/conn");
// router.use(cookieParser());

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/logout', authController.logoutUser);

router.get('/getdata', isAuthenticatedUser, authController.getdata);

module.exports = router;