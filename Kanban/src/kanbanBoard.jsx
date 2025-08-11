import React, { useState, useRef } from "react";
import "./index.css";

const initialData = {
  todo: [
    { id: "task-1", label: "Task 1" },
    { id: "task-2", label: "Task 2" },
  ],
  "in progress": [{ id: "task-3", label: "Task 3" }],
  done: [{ id: "task-4", label: "Task 4" }],
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTaskValue, setNewTaskValue] = useState(null);
  const dragTask = useRef(null);

  // Drag start
  const handleDragStart = (task, sourceCol) => {
    dragTask.current = { task, sourceCol };
  };

  // Drop
  const handleDrop = (targetCol) => {
    if (!dragTask.current) return;

    const { task, sourceCol } = dragTask.current;
    if (sourceCol === targetCol) return;

    setColumns((prev) => {
      const updated = { ...prev };
      updated[sourceCol] = updated[sourceCol].filter((t) => t.id !== task.id);
      updated[targetCol] = [...updated[targetCol], task];
      return updated;
    });

    dragTask.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Edit task
  const handleLabelClick = (taskId) => {
    setEditingTaskId(taskId);
  };

  const saveEditedTask = (taskId, newLabel) => {
    setColumns((prev) => {
      const updated = {};
      for (let col in prev) {
        updated[col] = prev[col].map((t) =>
          t.id === taskId ? { ...t, label: newLabel } : t
        );
      }
      return updated;
    });
    setEditingTaskId(null);
  };

  const handleEditKeyPress = (e, taskId) => {
    if (e.key === "Enter") {
      saveEditedTask(taskId, e.target.value);
    } else if (e.key === "Escape") {
      setEditingTaskId(null);
    }
  };

  // Delete task
  const deleteTask = (taskId) => {
    setColumns((prev) => {
      const updated = {};
      for (let col in prev) {
        updated[col] = prev[col].filter((t) => t.id !== taskId);
      }
      return updated;
    });
  };

  // Add task
  const addNewTaskInline = (columnId) => {
    if (!newTaskValue || !newTaskValue.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      label: newTaskValue.trim(),
    };
    setColumns((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newTask],
    }));
    setNewTaskValue(null);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Drag & Drop</h2>
      <div className="board">
        {["todo", "in progress", "done"].map((col) => (
          <div
            key={col}
            className="column"
            onDrop={() => handleDrop(col)}
            onDragOver={handleDragOver}
          >
            <h4>
              {col === "todo"
                ? "To Do"
                : col === "in progress"
                ? "In Progress"
                : "Done"}
            </h4>

            {columns[col].map((task) => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={() => handleDragStart(task, col)}
              >
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    defaultValue={task.label}
                    autoFocus
                    onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                    onBlur={(e) => saveEditedTask(task.id, e.target.value)}
                  />
                ) : (
                  <span onClick={() => handleLabelClick(task.id)}>
                    {task.label}
                  </span>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  🗑
                </button>
              </div>
            ))}

            {col === "todo" && (
              <div className="add-task-inline">
                {newTaskValue === null ? (
                  <button
                    className="add-task-btn"
                    onClick={() => setNewTaskValue("")}
                  >
                    + Add a task
                  </button>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter task..."
                    value={newTaskValue}
                    onChange={(e) => setNewTaskValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addNewTaskInline(col);
                      else if (e.key === "Escape") setNewTaskValue(null);
                    }}
                    onBlur={() => addNewTaskInline(col)}
                    autoFocus
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
