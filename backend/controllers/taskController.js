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
        const sortBy = req.query.sortBy || 'createdAt'; 
        const sortOrder = req.query.order === 'desc' ? -1 : 1; 

        // Pagination options
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 

        
        const tasks = await Task.find(query)
                                .sort({ [sortBy]: sortOrder }) 
                                .skip(skip)
                                .limit(limit);

        // Get total count of tasks matching the query for pagination metadata
        const totalTasks = await Task.countDocuments(query);

        // Send successful response with data and metadata
        res.status(200).json({
            success: true,
            count: tasks.length, 
            total: totalTasks,   
            page: page,
            limit: limit,
            data: tasks         
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

        
        res.status(200).json({ success: true, data: task });
    } catch (err) {
        
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
        console.log(req.body);
        const task = await Task.create(req.body);

        
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


exports.searchTasks = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query) {
            return res.status(400).json({ success: false, error: 'Search query is required' });
        }

        
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