const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');
const { protect, isReceptionist } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getDoctors)
  .post(protect, isReceptionist, createDoctor);

router.route('/:id')
  .get(protect, getDoctorById)
  .put(protect, isReceptionist, updateDoctor)
  .delete(protect, isReceptionist, deleteDoctor);

module.exports = router;
