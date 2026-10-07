const express = require("express");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id", updateTaskStatus);
router.delete("/:id", deleteTask);

module.exports = router;