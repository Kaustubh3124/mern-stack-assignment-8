import React from 'react';

function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
    // Format due date for display
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US') : 'No due date';

    // Function to get appropriate CSS class for priority styling
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return 'priority-high';
            case 'Medium': return 'priority-medium';
            case 'Low': return 'priority-low';
            default: return '';
        }
    };

    return (
        <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <div className="task-header">
                {/* Checkbox to toggle task completion status */}
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => onToggleComplete(task._id, task.isCompleted)}
                />
                {/* Task title, with strikethrough if completed */}
                <h3 className={task.isCompleted ? 'completed-text' : ''}>{task.title}</h3>
                {/* Task priority display with dynamic styling */}
                <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
            {/* Task description (only show if available) */}
            {task.description && <p className="task-description">{task.description}</p>}
            {/* Task metadata: due date and creation date */}
            <div className="task-meta">
                <span>Due: {dueDate}</span>
                <span>Created: {new Date(task.createdAt).toLocaleDateString('en-US')}</span>
            </div>
            {/* Action buttons for edit and delete */}
            <div className="task-actions">
                <button className="btn-edit" onClick={() => onEdit(task)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(task._id)}>Delete</button>
            </div>
        </div>
    );
}

export default TaskItem;