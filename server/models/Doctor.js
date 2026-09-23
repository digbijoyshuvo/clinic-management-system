const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  availableSchedule: {
    type: String,
    required: true,
  },
  contactInformation: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // URL or base64 for dummy icon
    default: '', // No default image; frontend uses SVG fallback
  },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
