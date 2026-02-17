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

    socket.on("task:updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
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
    <div className="flex flex-col gap-8">
      {/* Task Form Section */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 rounded-xl p-6 shadow-glow border border-slate-700/50">
        <TaskForm socket={socket} />
      </div>

      {/* Columns Section */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column title="To Do" status="todo" tasks={tasks} socket={socket} />
          <Column
            title="In Progress"
            status="inProgress"
            tasks={tasks}
            socket={socket}
          />
          <Column title="Done" status="done" tasks={tasks} socket={socket} />
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
