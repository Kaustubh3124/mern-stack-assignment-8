const express = require('express');
const dotenv = require('dotenv'); // To load environment variables from .env file
const colors = require('colors'); // Optional: for colorful console logs
const connectDB = require('./config/db'); // Import database connection function
const taskRoutes = require('./routes/taskRoutes'); // Import task API routes
const cors = require('cors'); // Import CORS middleware

// Load environment variables from .env file (must be called early)
dotenv.config({ path: './.env' });

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();

// --- Middleware ---
// Body parser for JSON requests: Express built-in middleware to parse JSON bodies from incoming requests.
// This allows you to access request body data via `req.body`.
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing):
// This middleware allows your frontend (running on a different origin/port) to make requests to this backend.
// For development, `cors()` without options allows all origins.
// In production, you might restrict this to your frontend's deployed URL (e.g., `cors({ origin: 'https://yourfrontend.netlify.app' })`).
app.use(cors());

// --- Routes ---
// Mount task routes: All routes defined in `taskRoutes.js` will be prefixed with `/api/tasks`.
// E.g., a GET request to `/api/tasks` will be handled by `taskRoutes`.
app.use('/api/tasks', taskRoutes);

// --- Global Error Handling Middleware ---
// This is a special Express middleware that catches errors thrown in other middleware or route handlers.
// It takes four arguments: (err, req, res, next).
app.use((err, req, res, next) => {
    // Log the error stack to the console for debugging (in red color if 'colors' package is used)
    console.error(err.stack.red);
    // Send a JSON error response to the client.
    // The status code will be whatever the error object specifies (err.statusCode) or 500 by default.
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error' // Send the error message or a generic 'Server Error'
    });
});

// --- Handle unhandled routes (404 Not Found) ---
// This middleware runs if no other routes have handled the request.
// It should be placed after all specific routes.
app.use((req, res, next) => {
    // Send a 404 Not Found response for any unmatched routes.
    res.status(404).json({
        success: false,
        error: `Not Found - ${req.originalUrl}` // Indicate which URL was not found
    });
});

// Define the port from environment variables (`.env` file) or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server: app.listen() makes the Express application listen for incoming HTTP requests on the specified port.
app.listen(PORT, () => {
    // This callback function is executed once the server successfully starts listening.
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
    console.log('Backend ready to receive API requests!'.green.bold);
    console.log(`Access tasks API at: http://localhost:${PORT}/api/tasks`);
});