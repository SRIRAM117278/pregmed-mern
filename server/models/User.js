const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  dateOfBirth: Date,
  dueDate: Date,
  currentWeek: Number,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  medicalHistory: [String],
  role: { type: String, enum: ['patient', 'provider', 'admin'], default: 'patient' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
