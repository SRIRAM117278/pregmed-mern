import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

/* =======================
   Middleware
======================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

/* =======================
   Health Check API
======================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =======================
   API Routes
======================= */
// import authRoutes from "./routes/auth.js";
// app.use("/api/auth", authRoutes);

/* =======================
   MongoDB Connection
======================= */
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI environment variable is missing");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

/* =======================
   Serve React Frontend (Production)
======================= */
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

/* =======================
   Start Server
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
