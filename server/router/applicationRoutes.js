const express = require('express');
const multer = require('multer');
const path = require('path')

const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate } = require("../middleware/authenticate");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join( __dirname,'..' ,'uploads/')); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });


router.get('/applications', authenticate, applicationController.getApplications);
router.post('/application-form', authenticate, upload.single("file"), applicationController.createNewApplication);
router.get('/applicant-applications',authenticate,  applicationController.getApplicationByUserId);
router.get('/application-view/:applicationId',authenticate, applicationController.getApplicationById);
router.put('/application-edit/:applicationId',authenticate, applicationController.updateApplication);

router.get('/application-for-reviewer', authenticate, applicationController.getApplicationForReviewer);
router.get('/application-for-admin', authenticate, applicationController.getApplicationForAdmin);


module.exports = router;