import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let tasks = [];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // sync all tasks
  socket.emit("sync:tasks", tasks);

  // create task
  socket.on("task:create", (task) => {
    try {
      if (!task?.id || !task?.title) return;
      tasks.push(task);
      io.emit("task:created", task);
    } catch (error) {
      console.error(error);
    }
  });

  // delete task
  socket.on("task:delete", (taskId) => {
    try {
      tasks = tasks.filter((task) => task.id !== taskId);
      io.emit("task:deleted", taskId);
    } catch (error) {
      console.error(error);
    }
  });

  // move task
  socket.on("task:move", ({ taskId, newStatus }) => {
    try {
      tasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      );
      const updatedTask = tasks.find((t) => t.id === taskId);
      io.emit("task:moved", updatedTask);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("task:update", ({ taskId, updates }) => {
    if (!taskId || !updates) return;
    try {
      tasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      );
      const updatedTask = tasks.find((t) => t.id === taskId);
      io.emit("task:updated", updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 8000, () =>
  console.log("Server running on port 8000"),
);
