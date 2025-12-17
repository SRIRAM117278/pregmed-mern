const express = require('express');
const router = express.Router();
const Guidance = require('../models/Guidance');
const { verifyToken } = require('../middleware/auth');

// Get guidance for current week
router.get('/current', verifyToken, async (req, res) => {
  try {
    const { week } = req.query;
    const guidance = await Guidance.findOne({ userId: req.userId, week });
    
    if (!guidance) {
      // Return default guidance for week
      return res.json({ week, message: 'No custom guidance found' });
    }
    
    res.json(guidance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all guidance for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const guidance = await Guidance.find({ userId: req.userId }).sort({ week: 1 });
    res.json(guidance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update guidance
router.post('/', verifyToken, async (req, res) => {
  try {
    const { week, symptoms, activities, nutrition, exercises, precautions, medicalTips } = req.body;
    
    let guidance = await Guidance.findOne({ userId: req.userId, week });
    
    if (guidance) {
      guidance = await Guidance.findByIdAndUpdate(
        guidance._id,
        { symptoms, activities, nutrition, exercises, precautions, medicalTips },
        { new: true }
      );
    } else {
      guidance = new Guidance({
        userId: req.userId,
        week,
        symptoms,
        activities,
        nutrition,
        exercises,
        precautions,
        medicalTips,
      });
      await guidance.save();
    }
    
    res.status(201).json(guidance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
