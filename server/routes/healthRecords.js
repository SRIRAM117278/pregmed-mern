const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/HealthRecord');
const { verifyToken } = require('../middleware/auth');

// Get all health records for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const records = await HealthRecord.find({ userId: req.userId })
      .populate('providerId', 'firstName lastName')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create health record
router.post('/', verifyToken, async (req, res) => {
  try {
    const { recordType, date, value, unit, notes } = req.body;
    
    const record = new HealthRecord({
      userId: req.userId,
      recordType,
      date,
      value,
      unit,
      notes,
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update health record
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete health record
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await HealthRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
