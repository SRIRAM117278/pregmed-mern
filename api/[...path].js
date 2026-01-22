const app = require('../server/app');
const { connectToDatabase } = require('../server/db');

// Serverless function handler for Vercel
module.exports = async (req, res) => {
  try {
    // Connect to MongoDB (cached across invocations)
    await connectToDatabase();
    
    // Pass request to Express app
    return app(req, res);
  } catch (err) {
    console.error('API Error:', err.message);
    
    // Don't expose internal errors in production
    const message = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;
    
    return res.status(500).json({ 
      success: false,
      message 
    });
  }
};
