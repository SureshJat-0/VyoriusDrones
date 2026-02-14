import { useEffect, useState } from "react";
import { filterTasks } from "../utils/taskUtils";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

export default function Column({ title, status, tasks, socket }) {
  const { setNodeRef } = useDroppable({ id: status });

  let filteredTasks = filterTasks(tasks, status);

  return (
    <div ref={setNodeRef} className="border p-4 rounded min-w-50 min-h-50">
      <h3>{title}</h3>
      {filteredTasks.map((task) => (
        <TaskCard task={task} key={task.id} socket={socket} />
      ))}
    </div>
  );
}
