const mongoose = require('mongoose');

// Define the schema (structure) for a single To-Do task
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'], // 'title' is a mandatory field
        trim: true, // Removes whitespace from both ends of a string
        maxlength: [100, 'Title cannot be more than 100 characters'] // Max length validation
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
        default: '' // Default to an empty string if not provided
    },
    isCompleted: {
        type: Boolean,
        default: false // New tasks are pending by default
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // Only allows these specific values
        default: 'Medium'
    },
    dueDate: {
        type: Date, // Stores date and time
        default: null // Optional field, no default date
    }
}, {
    timestamps: true // Mongoose automatically adds `createdAt` and `updatedAt` fields
});

// Create and export the Mongoose model based on the schema
// 'Task' will be the name of the collection in MongoDB (pluralized to 'tasks')
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;