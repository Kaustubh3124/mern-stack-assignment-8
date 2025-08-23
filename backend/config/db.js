const mongoose = require('mongoose');
const colors = require('colors'); // Optional: for colorful console logs

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Mongoose connects to the MongoDB database using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        // If connection fails, log the error and exit the process
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB; // Export the connection function