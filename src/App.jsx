import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (text.trim() === "") return alert("Task cannot be empty");
    if (todos.some((todo) => todo.text === text.trim())) {
      return alert("Duplicate task!");
    }

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setText("");
  };

  const filteredTodos = todos.filter((todo) => {
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
  
      <div style={{ marginTop: 15, marginBottom: 10 }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>
      <p>✅ Completed: {todos.filter(t => t.completed).length}</p>
      <ul style={{ marginTop: 20, paddingLeft: 0 }}>
        {filteredTodos
          .sort((a, b) => a.completed - b.completed)
          .map((todo) => (
          <li
            key={todo.id}
            style={{
              listStyle: "none",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                setTodos(
                  todos.map((t) =>
                    t.id === todo.id
                      ? { ...t, completed: !t.completed }
                      : t
                  )
                )
              }
            />
            <span
              style={{
                flexGrow: 1,
                marginLeft: 10,
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text} – <small>{timeAgo(todo.createdAt)}</small>
            </span>
            <button
              onClick={() => {
                const newText = prompt("Edit todo:", todo.text);
                if (newText && newText !== todo.text) {
                  setTodos(
                    todos.map((t) =>
                      t.id === todo.id ? { ...t, text: newText } : t
                    )
                  );
                }
              }}
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this task?")) {
                  setTodos(todos.filter((t) => t.id !== todo.id));
                }
              }}
              title="Delete"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Show time since created
function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export default App;
