const mongoose = require('mongoose');

const getDbUri = () => {
  const envUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (envUri) return envUri;

  // Default local DB (works with MongoDB Compass on the same machine)
  return 'mongodb://localhost:27017/pregmed';
};

let cached = global._mongooseCached;
if (!cached) {
  cached = global._mongooseCached = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const dbUri = getDbUri();
    if (!dbUri) {
      throw new Error('Missing MongoDB connection string. Set MONGODB_URI (or MONGO_URI).');
    }

    cached.promise = mongoose
      .connect(dbUri)
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectToDatabase };
