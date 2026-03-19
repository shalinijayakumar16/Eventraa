const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder (for images)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/users", require("./routes/userRoutes")); // ✅ moved here (IMPORTANT)

// Test route
app.get("/", (req, res) => {
  res.send("Eventra API Running...");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});