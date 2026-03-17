const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // 👈 ADD THIS

dotenv.config();

// Connect to MongoDB
connectDB(); // 👈 ADD THIS
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors()); // 👈 ADD THIS
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Eventra API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);


  app.use("/api/users", require("./routes/userRoutes"));// student register and login
});