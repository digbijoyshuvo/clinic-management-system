const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Normal User)
const bookAppointment = async (req, res) => {
  try {
    const { doctor, preferredDate, preferredTime, patientName, patientAge, patientPhone, reason } = req.body;

    if (!doctor || !preferredDate || !preferredTime || !patientName || !patientAge || !patientPhone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      user: req.user._id,
      doctor,
      preferredDate,
      preferredTime,
      patientName,
      patientAge,
      patientPhone,
      reason
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private (Receptionist sees all, User sees own)
const getAppointments = async (req, res) => {
  try {
    if (req.user.role === 'receptionist') {
      const appointments = await Appointment.find({}).populate('doctor', 'name designation speciality').populate('user', 'name email');
      return res.json(appointments);
    } else {
      const appointments = await Appointment.find({ user: req.user._id }).populate('doctor', 'name designation speciality');
      return res.json(appointments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve appointment and set reporting time
// @route   PUT /api/appointments/:id/approve
// @access  Private (Receptionist)
const approveAppointment = async (req, res) => {
  try {
    const { reportingTime } = req.body;
    
    if (!reportingTime) {
      return res.status(400).json({ message: 'Reporting time is required to approve' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'approved';
    appointment.reportingTime = reportingTime;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (User can cancel own, Receptionist can cancel any)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role === 'normal' && appointment.user.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  approveAppointment,
  cancelAppointment
};
