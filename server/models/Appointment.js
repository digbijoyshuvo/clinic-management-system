const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  patientName: {
    type: String,
    required: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },

  preferredDate: {
    type: String,
    required: true
  },

  preferredTime: {
    type: String,
    required: true
  },

  reportingTime: {
    type: String, // Set by receptionist
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },

  reason: {
    type: String,

  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);