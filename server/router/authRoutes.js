const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authenticate");

// const cookieParser = require("cookie-parser");
const authController = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authenticate')

require("../DB/conn");
// router.use(cookieParser());

// router.post('/register', authController.register);
router.post('/register', authController.registerUser);

// router.post('/login', authController.login);
router.post('/login', authController.loginUser);

// router.post('/passwordLink', authController.passwordLink);
// router.get('/forgotPassword/:id/:token', authController.forgotPassword); // called by /passwordLink

// router.post('/:id/:token', authController.setNewPassword);

// router.post('/emailVerificationLink', authenticate,  authController.emailVerificationLink);
// router.get('/verifyEmail/:id/:token', authController.verifyEmail);


// router.get('/logout/:userId', authController.logout);
router.get('/logout', authController.logoutUser);


// router.get('/about', authenticate, authController.about);
router.get('/getdata', isAuthenticatedUser, authController.getdata);

module.exports = router;
