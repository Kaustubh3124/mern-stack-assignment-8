const Task = require('../models/Task'); // Import the Task Mongoose model

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getTasks = async (req, res) => {
    try {
        // Build query object for filtering
        const query = {};
        if (req.query.status) {
            query.isCompleted = req.query.status === 'completed'; // Convert string 'completed'/'pending' to boolean
        }
        if (req.query.priority) {
            query.priority = req.query.priority;
        }

        // Sorting options
        const sortBy = req.query.sortBy || 'createdAt'; // Default sort by creation date
        const sortOrder = req.query.order === 'desc' ? -1 : 1; // 1 for ascending, -1 for descending

        // Pagination options
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit) || 10; // Number of items per page
        const skip = (page - 1) * limit; // Number of items to skip

        // Fetch tasks from the database with filtering, sorting, and pagination
        const tasks = await Task.find(query)
                                .sort({ [sortBy]: sortOrder }) // Dynamic sorting
                                .skip(skip)
                                .limit(limit);

        // Get total count of tasks matching the query for pagination metadata
        const totalTasks = await Task.countDocuments(query);

        // Send successful response with data and metadata
        res.status(200).json({
            success: true,
            count: tasks.length, // Number of tasks in the current page
            total: totalTasks,   // Total number of tasks matching criteria
            page: page,
            limit: limit,
            data: tasks          // The actual array of task objects
        });
    } catch (err) {
        // Log and send a 500 Internal Server Error if something goes wrong
        console.error('Error fetching tasks:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Public
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id); // Find task by ID from URL parameters

        if (!task) {
            // If task is not found, send a 404 response
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Send successful response with the found task
        res.status(200).json({ success: true, data: task });
    } catch (err) {
        // Handle specific error for invalid MongoDB ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, error: 'Invalid Task ID format' });
        }
        console.error('Error fetching single task:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
exports.createTask = async (req, res) => {
    try {
        // Create a new task document using the data from the request body
        const task = await Task.create(req.body);

        // Send successful response with the newly created task
        res.status(201).json({ // 201 Created status for successful resource creation
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (err) {
        // Handle Mongoose validation errors (e.g., missing required fields, invalid enum values)
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages }); // 400 Bad Request
        }
        console.error('Error creating task:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update an existing task
// @route   PATCH /api/tasks/:id
// @access  Public
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id); // Find task by ID

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Update the task document. {new: true} returns the updated document.
        // {runValidators: true} ensures schema validators are run on update operations.
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, error: 'Invalid Task ID format' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        console.error('Error updating task:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Delete the task. Mongoose 6+ uses deleteOne or deleteMany
        await Task.deleteOne({ _id: req.params.id });

        res.status(200).json({ success: true, message: 'Task removed successfully' }); // Or 204 No Content
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, error: 'Invalid Task ID format' });
        }
        console.error('Error deleting task:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a task's completion status
// @route   PATCH /api/tasks/:id/status
// @access  Public
exports.updateTaskStatus = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Basic validation for the isCompleted field
        if (typeof req.body.isCompleted !== 'boolean') {
            return res.status(400).json({ success: false, error: 'isCompleted field must be a boolean' });
        }

        task.isCompleted = req.body.isCompleted; // Update the status
        await task.save(); // Save the updated document to the database

        res.status(200).json({
            success: true,
            message: `Task marked as ${task.isCompleted ? 'completed' : 'pending'}`,
            data: task
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, error: 'Invalid Task ID format' });
        }
        console.error('Error updating task status:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Search tasks by title or description
// @route   GET /api/tasks/search
// @access  Public
exports.searchTasks = async (req, res) => {
    try {
        const { query } = req.query; // Get search query from URL query parameters

        if (!query) {
            return res.status(400).json({ success: false, error: 'Search query is required' });
        }

        // Use MongoDB's $or operator for searching across multiple fields
        // $regex for pattern matching, $options: 'i' for case-insensitive search
        const tasks = await Task.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 }); // Sort by most recent first

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        console.error('Error searching tasks:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};