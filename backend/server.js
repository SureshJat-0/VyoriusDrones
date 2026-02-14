import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let tasks = [];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // sync all tasks
  socket.emit("sync:tasks", tasks);

  // create task
  socket.on("task:create", (task) => {
    tasks.push(task);
    io.emit("task:created", task);
  });
  // delete task
  socket.on("task:delete", (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    io.emit("task:deleted", taskId);
  });

  // move task
  socket.on("task:move", ({ taskId, newStatus }) => {
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task,
    );
    const updatedTask = tasks.find((t) => t.id === taskId);
    io.emit("task:moved", updatedTask);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(8000, () => console.log("Server running on port 5000"));
