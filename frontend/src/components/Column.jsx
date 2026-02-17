import { useEffect, useState } from "react";
import { filterTasks } from "../utils/taskUtils";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

const columnConfig = {
  todo: {
    icon: "📋",
    color: "from-blue-500 to-blue-600",
    light: "from-blue-500/20 to-blue-600/20",
  },
  inProgress: {
    icon: "⚡",
    color: "from-purple-500 to-purple-600",
    light: "from-purple-500/20 to-purple-600/20",
  },
  done: {
    icon: "✅",
    color: "from-green-500 to-green-600",
    light: "from-green-500/20 to-green-600/20",
  },
};

export default function Column({ title, status, tasks, socket }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  let filteredTasks = filterTasks(tasks, status);
  const config = columnConfig[status];

  return (
    <div
      ref={setNodeRef}
      data-testid={`column-${status}`}
      className={`flex flex-col rounded-xl min-h-96 transition-all duration-300 ${
        isOver
          ? `bg-linear-to-b ${config.light} border-2 border-${status === "todo" ? "blue" : status === "inProgress" ? "purple" : "green"}-400/50 shadow-lg`
          : "bg-slate-800/50 border border-slate-700/50"
      }`}
    >
      {/* Column Header */}
      <div className={`bg-linear-to-r ${config.color} rounded-t-xl p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {filteredTasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p className="text-center">
              <span className="text-3xl mb-2 block">📭</span>
              No tasks yet
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard task={task} key={task.id} socket={socket} />
          ))
        )}
      </div>
    </div>
  );
}
