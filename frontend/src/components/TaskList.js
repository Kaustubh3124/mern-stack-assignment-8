import React, { useState } from 'react';
import TaskItem from './TaskItem'; // Individual task component
import TaskForm from './TaskForm'; // Re-use for editing in a modal

function TaskList({ tasks, onUpdate, onDelete, onToggleComplete }) {
    const [editingTask, setEditingTask] = useState(null); // State to hold the task currently being edited

    const handleEditClick = (task) => {
        setEditingTask(task); // Set the task data to the editing state
    };

    const handleUpdateSubmit = (updatedData) => {
        // Call the parent's onUpdate function with the task ID and updated data
        onUpdate(editingTask._id, updatedData);
        setEditingTask(null); // Close the edit modal after update
    };

    return (
        <div className="task-list-container">
            {/* Modal for editing tasks */}
            {editingTask && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <TaskForm onSubmit={handleUpdateSubmit} initialData={editingTask} />
                        <button className="btn-secondary" onClick={() => setEditingTask(null)}>Cancel Edit</button>
                    </div>
                </div>
            )}

            <h2>Your Tasks</h2>
            <div className="task-list">
                {/* Map through tasks and render TaskItem for each */}
                {tasks.map(task => (
                    <TaskItem
                        key={task._id} // Use MongoDB's _id as the unique key
                        task={task}
                        onEdit={handleEditClick}
                        onDelete={onDelete}
                        onToggleComplete={onToggleComplete}
                    />
                ))}
            </div>
        </div>
    );
}

export default TaskList;