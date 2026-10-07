const assert = require("node:assert/strict");
const test = require("node:test");
const request = require("supertest");
const app = require("../app");
const { Task } = require("../models/Task");

test("rejects task creation when the title is longer than 100 characters", async () => {
  const response = await request(app).post("/tasks").send({
    title: "a".repeat(101),
  });

  assert.equal(response.status, 400);
  assert.match(response.body.error, /100 characters or fewer/);
});

test("updates a task status successfully", async (t) => {
  const originalFindByIdAndUpdate = Task.findByIdAndUpdate;
  const taskId = "507f1f77bcf86cd799439011";
  const updatedTask = {
    _id: taskId,
    title: "Write API tests",
    description: "",
    status: "Done",
    priority: "High",
  };

  Task.findByIdAndUpdate = async (id, update) => {
    assert.equal(id, taskId);
    assert.deepEqual(update, { status: "Done" });
    return updatedTask;
  };
  t.after(() => {
    Task.findByIdAndUpdate = originalFindByIdAndUpdate;
  });

  const response = await request(app)
    .patch(`/tasks/${taskId}`)
    .send({ status: "Done" });

  assert.equal(response.status, 200);
  assert.equal(response.body.message, "Task status updated successfully.");
  assert.equal(response.body.task.status, "Done");
  assert.equal(response.body.task.title, "Write API tests");
});
