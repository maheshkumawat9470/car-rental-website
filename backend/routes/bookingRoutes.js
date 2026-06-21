const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getBookings);

router.route('/my-bookings')
  .get(protect, getMyBookings);

module.exports = router;
