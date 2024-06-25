const express = require('express');
const multer = require('multer');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticate = require("../middleware/authenticate");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });


router.get('/applications', authenticate, bookingController.getApplications);
router.post('/application-form', authenticate, upload.single("file"), bookingController.createNewApplication);
router.get('/applicant-applications',authenticate,  bookingController.getApplicationByUserId);
router.get('/application-view/:applicationId',authenticate, bookingController.getApplicationById);
router.put('/application-edit/:applicationId',authenticate, bookingController.updateApplication);

router.get('/application-for-reviewer', authenticate, bookingController.getApplicationForReviewer);
router.get('/application-for-admin', authenticate, bookingController.getApplicationForAdmin);

router.get('/events',  bookingController.getEvents);
router.get('/bookingsView/:bookingId',authenticate, bookingController.getBookingById);
// router.get('/bookings/:id', bookingController.getBookingById);
router.get('/bookingsFaculty',authenticate,  bookingController.getBookingByUserId);
router.post('/bookings',authenticate, bookingController.createBooking);
router.put('/bookingsEdit/:bookingId',authenticate, bookingController.updateBooking);
router.delete('/bookings/:bookingId',authenticate, bookingController.deleteBooking);

// router.get('/bookings', authenticate, bookingController.getBookings);
// router.get('/bookingsAdmin', authenticate, bookingController.getBookingAdmin);
// router.get('/bookingsHod', authenticate, bookingController.getBookingHod);

module.exports = router;