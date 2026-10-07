const mongoose = require("mongoose");
const { Task, STATUSES } = require("../models/Task");

const isValidStatus = (status) => STATUSES.includes(status);

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;
    const task = await Task.create({ title, description, status, priority });

    res.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    if (status && !isValidStatus(status)) {
      return res.status(400).json({
        error: "Invalid status filter. Use To Do, In Progress, or Done.",
      });
    }

    const tasks = await Task.find(status ? { status } : {}).sort({
      createdAt: -1,
    });

    res.json({
      message: status
        ? `Tasks filtered by status: ${status}.`
        : "Tasks loaded successfully.",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid task id" });
    }

    if (!isValidStatus(req.body.status)) {
      return res.status(400).json({
        error: "Status is required and must be To Do, In Progress, or Done.",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after", runValidators: true },
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const responseTask =
      typeof task.toObject === "function" ? task.toObject() : task;
    res.json({
      message: "Task status updated successfully.",
      task: responseTask,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid task id" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};
