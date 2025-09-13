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

// Ensure tasks.json exists (so Render won't crash on first run)
if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, JSON.stringify([], null, 2));
}

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

// Add new task (with validation)
app.post("/tasks", (req, res) => {
  if (!req.body || !req.body.text) {
    return res.status(400).json({ message: "Task text is required in JSON body" });
  }

  const tasks = loadTasks();
  const newTask = { id: Date.now(), text: req.body.text };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
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
