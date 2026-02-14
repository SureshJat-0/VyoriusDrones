import { describe, it, expect } from "vitest";
import {
  addTask,
  deleteTask,
  filterTasks,
  moveTask,
} from "../../utils/taskUtils.js";

describe("moveTask", () => {
  it("should update the status of correct task", () => {
    const tasks = [
      { id: "1", title: "Task 1", status: "todo" },
      { id: "2", title: "Task 2", status: "inProgress" },
    ];

    const updatedTasks = moveTask(tasks, "1", "done");

    expect(updatedTasks[0].status).toBe("done");
    expect(updatedTasks[1].status).toBe("inProgress");
  });

  it("should not modify the other tasks", () => {
    const tasks = [{ id: "1", title: "Task 1", status: "todo" }];
    const updatedTasks = moveTask(tasks, "99", "done");
    expect(updatedTasks).toEqual(tasks);
  });
});

describe("addTask", () => {
  it("should add new task", () => {
    const tasks = [];
    const task = { id: "1", title: "Task 1", status: "todo" };
    const updatedTasks = addTask(tasks, task);

    expect(updatedTasks.length).toBe(1);
    expect(updatedTasks[0]).toEqual(task);
  });
});

describe("deleteTask", () => {
  it("should delete task", () => {
    const tasks = [
      { id: "1", title: "Task 1", status: "todo" },
      { id: "2", title: "Task 2", status: "inProgress" },
    ];
    const updatedTask = deleteTask(tasks, "1");

    expect(updatedTask.length).toBe(1);
    expect(updatedTask[0].id).toBe("2");
  });
});

describe("filterTasks", () => {
  it("should filter task accordin to status", () => {
    const tasks = [
      { id: "1", title: "Task 1", status: "todo" },
      { id: "2", title: "Task 2", status: "done" },
    ];
    const updatedTasks = filterTasks(tasks, "done");

    expect(updatedTasks.length).toBe(1);
    expect(updatedTasks[0].id).toBe("2");
  });
});
