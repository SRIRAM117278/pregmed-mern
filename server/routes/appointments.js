const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { verifyToken } = require('../middleware/auth');

// Get all appointments for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate('providerId', 'firstName lastName email')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create appointment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, reason, description, type } = req.body;
    
    const appointment = new Appointment({
      userId: req.userId,
      appointmentDate,
      appointmentTime,
      reason,
      description,
      type,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
