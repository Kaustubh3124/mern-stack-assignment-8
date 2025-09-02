import React, { useState } from 'react';
import TaskItem from './TaskItem'; 
import TaskForm from './TaskForm'; 

function TaskList({ tasks, onUpdate, onDelete, onToggleComplete }) {
    const [editingTask, setEditingTask] = useState(null); 

    const handleEditClick = (task) => {
        setEditingTask(task); 
    };

    const handleUpdateSubmit = (updatedData) => {
        
        onUpdate(editingTask._id, updatedData);
        setEditingTask(null); 
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
                        key={task._id} 
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