const express = require('express');
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalHistory
} = require('../controllers/patientController');
const { protect, isReceptionist } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, isReceptionist, createPatient)
  .get(protect, isReceptionist, getPatients);

router.route('/:id')
  .get(protect, isReceptionist, getPatientById)
  .put(protect, isReceptionist, updatePatient)
  .delete(protect, isReceptionist, deletePatient);

router.route('/:id/history')
  .post(protect, isReceptionist, addMedicalHistory);


module.exports = router;
