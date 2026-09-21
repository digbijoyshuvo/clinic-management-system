const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect, requireRole } = require('../middleware/auth');

// @route   POST /api/patients
// @desc    Create a new patient
// @access  Private (Receptionist/Admin)
router.post('/', protect, requireRole('receptionist', 'admin'), async (req, res) => {
  try {
    const { name, age, gender, phone, address } = req.body;
    
    const newPatient = new Patient({
      name,
      age,
      gender,
      phone,
      address,
      registeredBy: req.user._id
    });

    const patient = await newPatient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/patients
// @desc    List all patients with optional search by name
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const patients = await Patient.find({ ...keyword }).populate('registeredBy', 'name email');
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/patients/:id
// @desc    Get single patient details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('registeredBy', 'name email');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient info
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const { name, age, gender, phone, address } = req.body;

    patient.name = name || patient.name;
    patient.age = age || patient.age;
    patient.gender = gender || patient.gender;
    patient.phone = phone || patient.phone;
    patient.address = address || patient.address;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Delete patient
// @access  Private (Admin only)
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/patients/:id/history
// @desc    Add a new medical history entry
// @access  Private (Doctor only)
router.post('/:id/history', protect, requireRole('doctor'), async (req, res) => {
  try {
    const { note, date } = req.body;
    
    if (!note) {
      return res.status(400).json({ message: 'Note is required' });
    }

    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newHistory = {
      note,
      date: date || Date.now()
    };

    patient.medicalHistory.push(newHistory);
    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
