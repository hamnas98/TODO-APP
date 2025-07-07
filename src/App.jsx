import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const trimmed = text.trim();
    if (!trimmed) return alert("Task cannot be empty");
    if (todos.some((todo) => todo.text === trimmed)) {
      return alert("Duplicate task!");
    }

    const newTodo = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    setText("");
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(todos, result.source.index, result.destination.index);
    setTodos(reordered);
  };

  const visibleTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>📝 Todo App</h2>

      <input
        type="text"
        placeholder="Add a task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setFilter("all")}>🟢 All</button>
        <button onClick={() => setFilter("completed")}>✅ Completed</button>
        <button onClick={() => setFilter("pending")}>🔄 Pending</button>
      </div>

      <div style={{ marginTop: 20, fontWeight: "bold", color: "#2c3e50" }}>
        ✅ {todos.filter((todo) => todo.completed).length} of {todos.length} tasks completed
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todoList">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ paddingLeft: 0, marginTop: 20 }}
            >
              {visibleTodos
                .sort((a, b) => a.completed - b.completed)
                .map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          listStyle: "none",
                          marginBottom: 10,
                          display: "flex",
                          alignItems: "center",
                          background: "#f4f4f4",
                          padding: 8,
                          borderRadius: 4,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => {
                            const updated = todos.map((t) =>
                              t.id === todo.id
                                ? { ...t, completed: !t.completed }
                                : t
                            );
                            setTodos(updated);
                          }}
                        />

                        <span
                          style={{
                            marginLeft: 8,
                            textDecoration: todo.completed ? "line-through" : "none",
                            color: todo.completed ? "gray" : "black",
                            flexGrow: 1,
                          }}
                        >
                          {todo.text}
                        </span>

                        <small style={{ marginLeft: 8, color: "#888" }}>
                          {timeAgo(todo.createdAt)}
                        </small>

                        <button
                          onClick={() => {
                            const newText = prompt("Edit your task:", todo.text);
                            if (newText && newText.trim() !== "") {
                              const isDuplicate = todos.some(
                                (t) =>
                                  t.text.toLowerCase() ===
                                    newText.trim().toLowerCase() &&
                                  t.id !== todo.id
                              );
                              if (isDuplicate) {
                                alert("Duplicate task not allowed.");
                                return;
                              }

                              const updated = todos.map((t) =>
                                t.id === todo.id
                                  ? { ...t, text: newText.trim() }
                                  : t
                              );
                              setTodos(updated);
                            }
                          }}
                          style={{ marginLeft: 8 }}
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Are you sure you want to delete this task?"
                            );
                            if (!confirmed) return;

                            const previousTodos = [...todos];
                            const updatedTodos = todos.filter((t) => t.id !== todo.id);
                            setTodos(updatedTodos);

                            setTimeout(() => {
                              const success = Math.random() > 0.2;
                              if (!success) {
                                alert("Failed to delete. Restoring previous state.");
                                setTodos(previousTodos);
                              }
                            }, 1000);
                          }}
                          style={{ marginLeft: 8 }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

// Time since created helper
function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export default App;
