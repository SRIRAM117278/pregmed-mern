const app = require('../server/app');
const { connectToDatabase } = require('../server/db');

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (err) {
    console.error('API bootstrap error:', err);
    res.status(500).json({ message: 'Server initialization failed' });
  }
};
