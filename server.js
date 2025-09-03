const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

dotenv.config({ path: "./.env" });

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack.red);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Not Found - ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

// For local development, listen on port
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`.yellow.bold);
  console.log("Backend ready to receive API requests!".green.bold);
  console.log(`Access tasks API at: http://localhost:${PORT}/api/tasks`);
});
