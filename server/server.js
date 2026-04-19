const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const Event = require("./models/Event");
const registrationRoutes = require("./routes/registrationRoutes");


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder (for images)
app.use("/uploads", express.static("uploads"));
// Serve certificate files so they can be accessed via URL
app.use("/certificates", express.static("certificates"));

// Routes
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/registrations", registrationRoutes);
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/department", require("./routes/departmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/recommendations", require("./routes/recommendationRoutes"));
app.use("/api/external-events", require("./routes/externalEvents"));

const normalizeLegacyEventStatuses = async () => {
  try {
    // Keep older events compatible with the new approval workflow
    await Event.updateMany(
      { status: { $in: ["active", "expired"] } },
      { $set: { status: "approved" } }
    );
  } catch (error) {
    console.log("Status migration error:", error.message);
  }
};

normalizeLegacyEventStatuses();

// Test route
app.get("/", (req, res) => {
  res.send("Eventra API Running...");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});