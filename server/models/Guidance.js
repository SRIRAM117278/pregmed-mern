const mongoose = require('mongoose');

const guidanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week: { type: Number, required: true },
  symptoms: [String],
  activities: [String],
  nutrition: {
    recommendations: [String],
    foodToAvoid: [String],
    supplements: [String]
  },
  exercises: [String],
  precautions: [String],
  medicalTips: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Guidance', guidanceSchema);
