import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  

  const addTodo = () => {
    if (text.trim() === "") return alert("Task cannot be empty");
    if (todos.some(todo => todo.text === text.trim())) {
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

      <ul style={{ marginTop: 20 }}>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text} – {timeAgo(todo.createdAt)}
          </li>
        ))}
      </ul>
    </div>
  );
}

// show time (helper function)
function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export default App;
