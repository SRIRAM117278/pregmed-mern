require('dotenv').config();

const http = require('http');
const app = require('./app');
const { connectToDatabase } = require('./db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
