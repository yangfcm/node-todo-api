const request = require("supertest");
const Todo = require("../models/todo");

const app = require("../app");
const { usersForTest, todosForTest, seed } = require("./seed/seed");

beforeEach(seed);

test("Create a task for user", async () => {
  const response = await request(app)
    .post("/todos")
    .set("x-auth", "Bearer " + usersForTest[0].tokens[0].token)
    .send({
      task: "Build API",
      description: "Build a nodo todo API",
    })
    .expect(200);
  const todo = await Todo.findById(response.body._id);
  expect(todo).not.toBeNull();
  expect(todo).toMatchObject({
    task: "Build API",
    description: "Build a nodo todo API",
    _creator: usersForTest[0]._id,
    completed: false,
    completedAt: null,
  });
});

test("Get tasks for a user", async () => {
  const response = await request(app)
    .get("/todos")
    .set("x-auth", "Bearer " + usersForTest[1].tokens[0].token)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(1);
});

test("Should not delete other user's task", async () => {
  const response = await request(app)
    .delete(`/todos/${todosForTest[0]._id}`)
    .set("x-auth", "Bearer " + usersForTest[1].tokens[0].token)
    .send()
    .expect(404);
  const todo = await Todo.findById(todosForTest[0]._id);
  expect(todo).not.toBeNull();
});
