import { useDraggable } from "@dnd-kit/core";

const priorityConfig = {
  low: { color: "bg-blue-500", label: "🔵 Low" },
  medium: { color: "bg-yellow-500", label: "🟡 Medium" },
  high: { color: "bg-red-500", label: "🔴 High" },
};

const categoryConfig = {
  feature: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    label: "✨ Feature",
  },
  bug: { bg: "bg-red-500/20", text: "text-red-400", label: "🐛 Bug" },
  improvement: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    label: "⬆️ Improvement",
  },
  documentation: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    label: "📚 Documentation",
  },
};

export default function TaskCard({ task, socket }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  const handleTaskDelete = (taskId) => {
    socket.emit("task:delete", taskId);
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const category = categoryConfig[task.category] || categoryConfig.feature;

  return (
    <div className="group">
      {/* Delete Button - Above the card */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => handleTaskDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-1 rounded transition-all"
          title="Delete task"
        >
          X
        </button>
      </div>

      {/* Draggable Card - Whole section is draggable */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-slate-700/60 border border-slate-600/50 rounded-lg p-4 hover:border-slate-500 shadow-glow cursor-grab active:cursor-grabbing hover:shadow-lg ${
          isDragging ? "ring-2 ring-blue-400" : ""
        }`}
      >
        {/* Title */}
        <h4 className="text-slate-100 font-semibold mb-3 text-sm line-clamp-2">
          {task.title}
        </h4>

        {/* Image preview  */}
        {task.attachments?.length > 0 && (
          <div className="mt-2 space-y-2">
            {task.attachments.map((file, index) => (
              <div key={index}>
                {file.type.startsWith("image") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    data-testid="task-image-preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {file.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Priority Badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${priority.color} text-white`}
          >
            {priority.label}
          </span>

          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${category.bg} ${category.text}`}
          >
            {category.label}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
