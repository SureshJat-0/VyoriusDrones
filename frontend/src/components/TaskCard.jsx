import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task, socket }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const handleTaskDelete = (taskId) => {
    socket.emit("task:delete", taskId);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border my-4 p-2"
    >
      <div className="border" {...listeners}>
        <h4>{task.title}</h4>
        <p>Priority: {task.priority}</p>
        <p>Category: {task.category}</p>
      </div>
      <button onClick={() => handleTaskDelete(task.id)} className="border rounded">
        Delete
      </button>
    </div>
  );
}
