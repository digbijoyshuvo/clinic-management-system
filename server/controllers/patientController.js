const Patient = require('../models/Patient');

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private (Receptionist)
const createPatient = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all patients
// @route   GET /api/patients
// @access  Private (Receptionist)
const getPatients = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient details
// @route   GET /api/patients/:id
// @access  Private (Receptionist)
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('registeredBy', 'name email');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient info
// @route   PUT /api/patients/:id
// @access  Private (Receptionist)
const updatePatient = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Receptionist)
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new medical history entry
// @route   POST /api/patients/:id/history
// @access  Private (Receptionist)
const addMedicalHistory = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalHistory
};
