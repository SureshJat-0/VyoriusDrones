import { useState, useRef } from "react";
import { generate } from "short-uuid";

export default function TaskForm({ socket }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("feature");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const addTaskHandler = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const task = {
        id: generate(),
        title,
        status: "todo",
        priority,
        category,
        attachments: selectedFile
          ? [
              {
                name: selectedFile.name,
                url: URL.createObjectURL(selectedFile),
                type: selectedFile.type,
              },
            ]
          : [],
        createdAt: Date.now(),
      };
      socket.emit("task:create", task);
      setTitle("");
      setPriority("medium");
      setCategory("feature");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={addTaskHandler}
      className="w-full space-y-4"
      encType="multipart/form-data"
    >
      {/* Title Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          ✏️
        </span>
      </div>
      <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 animate-in fade-in slide-in-from-top-2">
        {/* Priority and Category Selectors */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
            >
              <option value="low">🔵 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
            >
              <option value="feature">✨ Feature</option>
              <option value="bug">🐛 Bug</option>
              <option value="improvement">⬆️ Improvement</option>
              <option value="documentation">📚 Documentation</option>
            </select>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-3 pt-2 border-t border-slate-600/30">
          <label className="block text-sm font-medium text-slate-400">
            📎 Attachment
          </label>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            data-testid="file-input"
            onChange={(e) => handleFileUpload(e)}
            accept="image/*,.pdf"
            type="file"
            name="file"
            className="hidden"
          />

          {/* Upload Button */}
          {!selectedFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-lg transition-all duration-200 text-slate-300 hover:text-blue-400 font-medium flex items-center justify-center gap-2"
            >
              <span>📁</span>
              <span>Choose File</span>
            </button>
          ) : (
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">
                  {selectedFile.type.startsWith("image/") ? "🖼️" : "📄"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-2 px-3 py-1 text-xs bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded transition-all"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-all duration-200 active:scale-95"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              handleRemoveFile();
            }}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
