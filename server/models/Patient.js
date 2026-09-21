const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  note: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  medicalHistory: [medicalHistorySchema],
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt
});

module.exports = mongoose.model('Patient', patientSchema);
