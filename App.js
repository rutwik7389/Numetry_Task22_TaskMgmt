import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
const App = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", status: "Pending", due_date: "" });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await axios.get("http://localhost:5000/tasks");
        setTasks(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:5000/tasks", form);
        fetchTasks();
        setForm({ title: "", description: "", status: "Pending", due_date: "" });
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        fetchTasks();
    };

    const handleStatusChange = async (id, status) => {
        await axios.put(`http://localhost:5000/tasks/${id}`, { status });
        fetchTasks();
    };

    return (
        <div>
            <h1>Daily Task Management System</h1>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <input type="date" name="due_date" value={form.due_date} onChange={handleChange} required />
                <button type="submit">Add Task</button>
            </form>

            <h2>Task List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>
                                <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                            <td>{task.due_date}</td>
                            <td>
                                <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
