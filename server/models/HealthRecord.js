const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recordType: { 
    type: String, 
    enum: ['blood_pressure', 'weight', 'glucose', 'ultrasound', 'blood_test', 'other'],
    required: true 
  },
  date: { type: Date, required: true },
  value: String,
  unit: String,
  notes: String,
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachments: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
