const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todolist";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/tasks", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Task name is required");
  try {
    const newTask = new Task({ name });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
    if (!task) return res.status(404).send("Task not found");
    res.json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));