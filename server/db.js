const mongoose = require('mongoose');

const getDbUri = () => {
  // Production: must use MONGODB_URI from environment
  const envUri = process.env.MONGODB_URI;

  if (envUri) return envUri;

  // Development fallback only (never use in production)
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Using local MongoDB. Set MONGODB_URI for production.');
    return 'mongodb://localhost:27017/pregmed';
  }

  return null;
};

// Cache connection across serverless invocations
let cached = global._mongooseCached;
if (!cached) {
  cached = global._mongooseCached = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const dbUri = getDbUri();
    if (!dbUri) {
      throw new Error('MONGODB_URI environment variable is required in production.');
    }

    cached.promise = mongoose
      .connect(dbUri, {
        bufferCommands: false, // Disable buffering for serverless
      })
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected');
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectToDatabase };
