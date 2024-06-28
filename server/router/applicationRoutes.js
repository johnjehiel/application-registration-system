const express = require('express');
const multer = require('multer');
const path = require('path')

const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, isAuthenticatedUser } = require("../middleware/authenticate");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join( __dirname,'..' ,'uploads/')); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });


router.get('/applications', isAuthenticatedUser, applicationController.getApplications);
router.post('/application-form', isAuthenticatedUser, upload.single("file"), applicationController.createNewApplication);
router.get('/applicant-applications',isAuthenticatedUser,  applicationController.getApplicationByUserId);
router.get('/application-view/:applicationId',isAuthenticatedUser, applicationController.getApplicationById);
router.put('/application-edit/:applicationId',isAuthenticatedUser, applicationController.updateApplication);

router.get('/application-for-reviewer', isAuthenticatedUser, applicationController.getApplicationForReviewer);
router.get('/application-for-admin', isAuthenticatedUser, applicationController.getApplicationForAdmin);


module.exports = router;