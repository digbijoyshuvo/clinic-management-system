const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');

const { protect, requireRole } = require('../middleware/auth');


// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private (Receptionist/Admin)
router.post('/', protect, requireRole('receptionist', 'admin'), async (req, res) => {
  try {
    const { patient, doctor, date, time, reason } = req.body;

    if (!patient || !doctor || !date || !time || !reason) {
      return res.status(400).json({
        message: 'Patient, doctor, date, time and reason are required'
      });
    }

    const patientExists = await Patient.findById(patient);

    if (!patientExists) {
      return res.status(404).json({
        message: 'Patient not found'
      });
    }

    const doctorExists = await User.findById(doctor);

    if (!doctorExists) {
      return res.status(404).json({
        message: 'Doctor not found'
      });
    }

    if (doctorExists.role !== 'doctor') {
      return res.status(400).json({
        message: 'Selected user is not a doctor'
      });
    }

    const appointment = new Appointment({
      patient,
      doctor,
      date,
      time,
      reason
    });

    const savedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('patient', 'name')
      .populate('doctor', 'name email');

    res.status(201).json(populatedAppointment);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// @route   GET /api/appointments
// @desc    Get all appointments with optional filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { date, doctor, status } = req.query;

    const filter = {};

    if (date) {
      filter.date = date;
    }

    if (doctor) {
      filter.doctor = doctor;
    }

    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name')
      .populate('doctor', 'name email')
      .sort({ date: 1, time: 1 });

    res.json(appointments);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});

// @route   GET /api/appointments/doctors
// @desc    Get all doctors
// @access  Private
router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('_id name email');

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});

// @route   GET /api/appointments/doctor/:doctorId
// @desc    Get appointments for a specific doctor
// @access  Private
router.get('/doctor/:doctorId', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId
    })
      .populate('patient', 'name')
      .populate('doctor', 'name email')
      .sort({ date: 1, time: 1 });

    res.json(appointments);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// @route   PUT /api/appointments/:id
// @desc    Update/reschedule appointment
// @access  Private (Receptionist/Admin)
router.put('/:id', protect, requireRole('receptionist', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    const { patient, doctor, date, time, reason, status } = req.body;

    if (patient) {
      const patientExists = await Patient.findById(patient);

      if (!patientExists) {
        return res.status(404).json({
          message: 'Patient not found'
        });
      }

      appointment.patient = patient;
    }

    if (doctor) {
      const doctorExists = await User.findById(doctor);

      if (!doctorExists) {
        return res.status(404).json({
          message: 'Doctor not found'
        });
      }

      if (doctorExists.role !== 'doctor') {
        return res.status(400).json({
          message: 'Selected user is not a doctor'
        });
      }

      appointment.doctor = doctor;
    }

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;

    if (status) {
      if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          message: 'Invalid appointment status'
        });
      }

      appointment.status = status;
    }

    const updatedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patient', 'name')
      .populate('doctor', 'name email');

    res.json(populatedAppointment);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    appointment.status = 'cancelled';

    const cancelledAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(cancelledAppointment._id)
      .populate('patient', 'name')
      .populate('doctor', 'name email');

    res.json(populatedAppointment);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// @route   PUT /api/appointments/:id/complete
// @desc    Mark appointment as completed
// @access  Private (Doctor only)
router.put('/:id/complete', protect, requireRole('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only complete your own appointments'
      });
    }

    appointment.status = 'completed';

    const completedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(completedAppointment._id)
      .populate('patient', 'name')
      .populate('doctor', 'name email');

    res.json(populatedAppointment);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});


module.exports = router;