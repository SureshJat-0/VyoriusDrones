import { useState } from "react";
import { generate } from "short-uuid";

export default function TaskForm({ socket }) {
  const [title, setTitle] = useState("");
  const addTaskHandler = (e) => {
    e.preventDefault();
    try {
      const task = {
        id: generate(),
        title,
        description: "This is description field.",
        status: "todo",
        priority: "medium",
        category: "feature",
        attachments: [],
        createdAt: Date.now(),
      };
      socket.emit("task:create", task);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={(e) => addTaskHandler(e)}>
      <input
        type="text"
        placeholder="task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add task</button>
    </form>
  );
}
