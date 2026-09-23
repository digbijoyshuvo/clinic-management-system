const express = require('express');
const router = express.Router();

const {
  bookAppointment,
  getAppointments,
  approveAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect, isReceptionist, isNormalUser } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, isNormalUser, bookAppointment)
  .get(protect, getAppointments);

router.route('/:id/approve')
  .put(protect, isReceptionist, approveAppointment);

router.route('/:id/cancel')
  .put(protect, cancelAppointment);


module.exports = router;