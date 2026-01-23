// server.js
import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { connectToDatabase } from "./db.js"; // make sure your db.js uses export
// import routes
import authRoutes from "./routes/auth.js"; // your login routes

dotenv.config();

const app = express();

// 1️⃣ Middleware
app.use(express.json());

// 2️⃣ CORS setup for Netlify frontend
app.use(cors({
  origin: "https://your-site-name.netlify.app", // replace with your Netlify URL
  credentials: true  // needed if you use cookies or sessions
}));

// 3️⃣ Routes
app.use("/api/auth", authRoutes); // your login/register routes

// 4️⃣ Optional test route
app.get("/api/test", (req, res) => {
  res.json({ status: "Backend reachable!" });
});

// 5️⃣ Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase(); // ensure DB connection

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

