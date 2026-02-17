import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import KanbanBoard from "../../components/KanbanBoard";
import Navbar from "../../components/Navbar";

// mock socket
const createMockSocket = () => {
  let handlers = {};

  return {
    // real socket saves the callback internaly and calls it later
    // mock socket does not do that, so store event name and callback in handlers
    on: vi.fn((event, callback) => {
      handlers[event] = callback;
    }),
    off: vi.fn(),
    emit: vi.fn(),
    trigger: (event, data) => {
      if (handlers[event]) {
        handlers[event](data);
      }
    },
  };
};

describe("KanbanBoard Integration", () => {
  let mockSocket;
  beforeEach(() => {
    mockSocket = createMockSocket();
  });

  it("renders Kanban Board", () => {
    render(<Navbar socket={mockSocket} />);

    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  });

  // check for all columns rendering
  it("renders all three column", () => {
    render(<KanbanBoard socket={mockSocket} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  // socket emit - task:create
  it("emit socket event when adding a task", () => {
    render(<KanbanBoard socket={mockSocket} />);

    const input = screen.getByPlaceholderText(/Add a new task.../i);
    const button = screen.getByText(/Create Task/i);

    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(button);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "task:create",
      expect.objectContaining({ title: "Test Task" }),
    );
  });
  // ui update after socket event received
  it("updates ui when task:created, task:deleted, task:moved event received", async () => {
    render(<KanbanBoard socket={mockSocket} />);

    const MockTask = {
      id: "1",
      title: "Mock Task",
      status: "todo",
      priority: "medium",
      category: "feature",
      attachments: [],
    };

    // 1. task:created
    act(() => {
      mockSocket.trigger("task:created", MockTask);
    });
    await screen.findByText("Mock Task");

    // 2. task:deleted
    act(() => {
      mockSocket.trigger("task:deleted", "1");
    });
    await waitFor(() => {
      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });

    // 3. task:moved
    // task:created
    act(() => {
      mockSocket.trigger("task:created", MockTask);
    });
    await screen.findByText("Mock Task");

    // confirm task is in To Do column
    const todoColumn = screen.getByText("To Do").closest("div").parentElement
      .parentElement.parentElement;
    expect(todoColumn).toHaveTextContent("Mock Task");

    // task:moved
    act(() => {
      mockSocket.trigger("task:moved", { id: "1", status: "done" });
    });

    // confirm task is in Done column
    await waitFor(() => {
      const doneColumn = screen.getByText("Done").closest("div").parentElement
        .parentElement.parentElement;
      expect(doneColumn).toHaveTextContent("Mock Task");
    });

    // Ensure it is no longer in To Do column
    await waitFor(() => {
      const todoColumnAfter = screen.getByText("To Do").closest("div")
        .parentElement.parentElement.parentElement;
      expect(todoColumnAfter).not.toHaveTextContent("Mock Task");
    });
  });
});
