const express = require("express");
const cors = require("cors");
const tasksRouter = require("./routes/tasks_routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/tasks", tasksRouter);

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must be valid JSON" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: Object.values(error.errors)
        .map((validationError) => validationError.message)
        .join(", "),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "The provided task data is invalid" });
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;