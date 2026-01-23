require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

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

      // Allow Netlify deployments (e.g. https://your-site.netlify.app)
      const isNetlify = origin.endsWith('.netlify.app');

      // Allow custom frontend URL from environment (Render setting FRONTEND_URL)
      const customFrontend = process.env.FRONTEND_URL;

      if (
        allowedLocal.includes(origin) ||
        isNetlify ||
        (customFrontend && origin === customFrontend)
      ) {
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

// Health check endpoint (useful for monitoring)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve React frontend in production (like the example server/index.js)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');

  // Serve static files from the React app
  app.use(express.static(clientBuildPath));

  // Handle all routes by serving React's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API endpoint not found: ${req.method} ${req.originalUrl}` 
  });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
    
  res.status(err.status || 500).json({ 
    success: false,
    message 
  });
});

module.exports = app;
