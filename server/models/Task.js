const mongoose = require("mongoose");

const STATUSES = ["To Do", "In Progress", "Done"];
const PRIORITIES = ["Low", "Medium", "High"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title must be 100 characters or fewer"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: "Status must be To Do, In Progress, or Done",
      },
      default: "To Do",
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: "Priority must be Low, Medium, or High",
      },
      default: "Medium",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
  },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = {
  Task,
  STATUSES,
  PRIORITIES,
};
