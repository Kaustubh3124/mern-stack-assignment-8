const express = require('express');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus, // For specific status update
    searchTasks // For search functionality
} = require('../controllers/taskController'); // Import controller functions

const router = express.Router(); // Create an Express router instance

// Define routes for tasks
router.route('/').get(getTasks).post(createTask); // GET all tasks, POST new task
router.get('/search', searchTasks); // GET /api/tasks/search?query=...
router.patch('/:id/status', updateTaskStatus); // PATCH /api/tasks/:id/status (e.g., {isCompleted: true})

router.route('/:id')
    .get(getTask)    // GET a single task by ID
    .patch(updateTask) // PATCH to update task (partial update)
    .delete(deleteTask); // DELETE a task by ID

module.exports = router; // Export the router