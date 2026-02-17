import KanbanBoard from "./components/KanbanBoard";
import { io } from "socket.io-client";
import Navbar from "./components/Navbar";

const socket = io(import.meta.env.VITE_SOCKET_URL);

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <KanbanBoard socket={socket} />
      </main>
    </div>
  );
}

export default App;
