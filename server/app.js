require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      const allowedLocal = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
      ];

      // Allow Vercel deployments
      const isVercel = origin.endsWith('.vercel.app');
      
      // Allow custom frontend URL from environment
      const customFrontend = process.env.FRONTEND_URL;

      if (allowedLocal.includes(origin) || isVercel || origin === customFrontend) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/health-records', require('./routes/healthRecords'));
app.use('/api/community', require('./routes/community'));
app.use('/api/guidance', require('./routes/guidance'));

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
