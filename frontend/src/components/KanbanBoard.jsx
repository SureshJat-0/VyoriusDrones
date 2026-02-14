import { useState } from "react";
import { useEffect } from "react";
import TaskForm from "./TaskForm";
import Column from "./Column";
import { DndContext } from "@dnd-kit/core";
import { addTask, deleteTask, moveTask } from "../utils/taskUtils";

function KanbanBoard({ socket }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // sync all the tasks on render
    socket.on("sync:tasks", (data) => {
      setTasks(data);
    });

    socket.on("task:created", (task) => {
      setTasks((prev) => addTask(prev, task));
    });

    socket.on("task:deleted", (taskId) => {
      setTasks((prev) => deleteTask(prev, taskId));
    });

    // task move
    socket.on("task:moved", (updatedTask) => {
      setTasks((prev) => moveTask(prev, updatedTask.id, updatedTask.status));
    });

    return () => {
      socket.off("sync:tasks");
      socket.off("task:created");
      socket.off("task:deleted");
      socket.off("task:moved");
    };
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    socket.emit("task:move", { taskId, newStatus });
  };

  return (
    <div className="flex flex-col">
      <h2>Kanban Board</h2>

      {/* adding tasks */}
      <TaskForm socket={socket} />

      {/* rendering tasks */}
      <DndContext
        onDragEnd={handleDragEnd}
        className="flex justify-between gap-5 grow"
      >
        <Column title="To Do" status="todo" tasks={tasks} socket={socket} />
        <Column
          title="In Progress"
          status="inProgress"
          tasks={tasks}
          socket={socket}
        />
        <Column title="Done" status="done" tasks={tasks} socket={socket} />
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
