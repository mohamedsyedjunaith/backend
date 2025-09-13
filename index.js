const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5500;


// Middleware
app.use(cors());
app.use(express.json());

// File path for tasks.json
const tasksFile = path.join(__dirname, "tasks.json");

// Load tasks from file
const loadTasks = () => {
  try {
    return JSON.parse(fs.readFileSync(tasksFile, "utf-8"));
  } catch {
    return [];
  }
};

// Save tasks to file
const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

// Default route
app.get("/", (req, res) => {
  res.send("✅ Backend is running! Try <a href='/tasks'>/tasks</a> to see tasks.");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(loadTasks());
});

// Add new task
app.post("/tasks", (req, res) => {
  const tasks = loadTasks();
  const newTask = { id: Date.now(), text: req.body.text };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  const beforeCount = tasks.length;
  tasks = tasks.filter((task) => task.id != req.params.id);
  saveTasks(tasks);
  if (tasks.length < beforeCount) {
    res.json({ message: "Task deleted" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
