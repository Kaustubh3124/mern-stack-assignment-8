import React, { useState, useEffect } from 'react';

function TaskForm({ onSubmit, initialData = null }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            // Convert ISO string to YYYY-MM-DD for date input type
            setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
            setPriority(initialData.priority || 'Medium');
        } else {
            // Reset form for adding new task
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Medium');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null, // Convert to ISO string for backend
            priority
        };
        onSubmit(taskData);
        // Clear form fields only if it's for adding a new task (not editing)
        if (!initialData) {
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Medium');
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>{initialData ? 'Edit Task' : 'Add New Task'}</h2>
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                ></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="dueDate">Due Date:</label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="priority">Priority:</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <button type="submit" className="btn-primary">
                {initialData ? 'Update Task' : 'Add Task'}
            </button>
        </form>
    );
}

export default TaskForm;