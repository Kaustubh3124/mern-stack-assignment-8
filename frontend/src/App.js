import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm.js';
import TaskList from './components/TaskList.js';
import './App.css'; 


function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
    const [searchQuery, setSearchQuery] = useState('');

    // Base URL for API calls. IMPORTANT: Change this for deployment!
    // For local development, 'proxy' in package.json handles this.
    // For Netlify deployment, replace this with your Render backend URL.
   const API_BASE_URL = process.env.REACT_APP_API_URL ||'http://localhost:5000';
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let url = `${API_BASE_URL}/api/tasks`; // Start with base tasks endpoint

            const params = {};
            // Add filter parameters if not 'all'
            if (filterStatus !== 'all') {
                params.status = filterStatus;
            }
            // If there's a search query, adjust URL to search endpoint and add query param
            if (searchQuery) {
                url = `${API_BASE_URL}/api/tasks/search`;
                params.query = searchQuery;
            }

            const response = await axios.get(url, { params });
            
            setTasks(response.data.data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            setError(err.response ? err.response.data.error : 'Network Error');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, searchQuery]); // Re-fetch when filter, search query, or base URL changes

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = async (taskData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/tasks`, taskData);
            setTasks(prevTasks => [...prevTasks, response.data.data]);
        } catch (err) {
            console.error('Failed to add task:', err);
            setError(err.response ? err.response.data.error : 'Network Error');
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.patch(`${API_BASE_URL}/api/tasks/${id}`, updatedData);
            setTasks(prevTasks =>
                prevTasks.map(task => (task._id === id ? response.data.data : task))
            );
        } catch (err) {
            console.error('Failed to update task:', err);
            setError(err.response ? err.response.data.error : 'Network Error');
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
        } catch (err) {
            console.error('Failed to delete task:', err);
            setError(err.response ? err.response.data.error : 'Network Error');
        } finally {
            setLoading(false);
        }
    };

    const toggleComplete = async (id, isCompleted) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.patch(`${API_BASE_URL}/api/tasks/${id}/status`, { isCompleted: !isCompleted });
            setTasks(prevTasks =>
                prevTasks.map(task => (task._id === id ? response.data.data : task))
            );
        } catch (err) {
            console.error('Failed to toggle status:', err);
            setError(err.response ? err.response.data.error : 'Network Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>MERN Stack To-Do List</h1>
            </header>
            <main className="App-main">
                <TaskForm onSubmit={addTask} />

                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending Tasks</option>
                        <option value="completed">Completed Tasks</option>
                    </select>
                </div>

                {loading && <div className="message loading">Loading tasks...</div>}
                {error && <div className="message error">Error: {error}</div>}

                {/* {!loading && !error && tasks && (
                    <div className="message no-tasks">No tasks found.</div>
                )} */}

                <TaskList
                    tasks={tasks}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onToggleComplete={toggleComplete}
                />
            </main>
            <footer className="App-footer">
                <p>&copy; 2025 MERN To-Do App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;