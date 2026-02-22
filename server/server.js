import express from "express";
import {config} from "dotenv";
import { connectDB, disconnectDB } from "./src/config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Handle unhandled promis rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM recived, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  })
})

//Import Routes
import tripRoutes from "./src/routes/trips/tripRoutes.js"
import authRoutes from "./src/routes/auth/authRoutes.js"


config()
connectDB()

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use("/trips", tripRoutes)
app.use("/auth", authRoutes)


// Test route
app.get("/", (req, res) => {
  res.send("Trip Planner API is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
