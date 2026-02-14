import KanbanBoard from "./components/KanbanBoard";

import { io } from "socket.io-client";
const socket = io("http://localhost:8000");

function App() {
  return (
    <div className="App">
      <h1>Real-time Kanban Board</h1>
      <KanbanBoard socket={socket} />
    </div>
  );
}

export default App;
