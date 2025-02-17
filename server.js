const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root", 
    database: "task_management"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Create Task
app.post("/tasks", (req, res) => {
    const { title, description, status, due_date } = req.body;
    const sql = "INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, description, status, due_date], (err, result) => {
        if (err) throw err;
        res.json({ message: "Task created successfully", id: result.insertId });
    });
});

// Get All Tasks
app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Update Task
app.put("/tasks/:id", (req, res) => {
    const { title, description, status, due_date } = req.body;
    const sql = "UPDATE tasks SET title=?, description=?, status=?, due_date=? WHERE id=?";
    db.query(sql, [title, description, status, due_date, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Task updated successfully" });
    });
});

// Delete Task
app.delete("/tasks/:id", (req, res) => {
    db.query("DELETE FROM tasks WHERE id=?", [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Task deleted successfully" });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
