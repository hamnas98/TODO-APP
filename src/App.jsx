import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Sun, Moon, GripVertical, Check } from "lucide-react";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Note: localStorage not available in Claude artifacts, using memory storage
    const stored = window.todoStorage || [];
    setTodos(stored);
  }, []);

  useEffect(() => {
    window.todoStorage = todos;
  }, [todos]);

  const addTodo = () => {
    const trimmed = text.trim();
    if (trimmed === "") return;
    if (todos.some((todo) => todo.text.toLowerCase() === trimmed.toLowerCase())) {
      return;
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

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const editTodo = (id, newText) => {
    const isDuplicate = todos.some(
      (t) => t.text.toLowerCase() === newText.toLowerCase() && t.id !== id
    );
    if (isDuplicate) return;

    const updated = todos.map((t) =>
      t.id === id ? { ...t, text: newText } : t
    );
    setTodos(updated);
  };

  const toggleComplete = (id) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
  };

  const visibleTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      transition: 'all 0.3s ease',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <Check style={{ width: '30px', height: '30px', color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              Focus
            </h1>
          </div>
          <p style={{
            color: darkMode ? '#a0a0a0' : 'rgba(255,255,255,0.8)',
            fontSize: '16px',
            margin: 0
          }}>
            Stay organized and get things done
          </p>
        </div>

        {/* Theme Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '15px',
              borderRadius: '15px',
              border: 'none',
              background: darkMode 
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.9)',
              color: darkMode ? '#ffd700' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Add Todo Input */}
        <div style={{
          background: darkMode 
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                flex: 1,
                padding: '15px 20px',
                border: '2px solid transparent',
                borderRadius: '15px',
                fontSize: '16px',
                background: darkMode 
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)',
                color: darkMode ? 'white' : '#333',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'transparent';
                e.target.style.transform = 'scale(1)';
              }}
            />
            <button
              onClick={addTodo}
              disabled={!text.trim()}
              style={{
                padding: '15px 25px',
                background: text.trim() 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: text.trim() ? '0 5px 20px rgba(102, 126, 234, 0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (text.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = text.trim() ? '0 5px 20px rgba(102, 126, 234, 0.4)' : 'none';
              }}
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          padding: '20px',
          background: darkMode 
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(255,255,255,0.9)',
          borderRadius: '20px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          {[
            { key: 'all', label: 'All Tasks', icon: '📋' },
            { key: 'pending', label: 'Pending', icon: '🔄' },
            { key: 'completed', label: 'Completed', icon: '✅' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                background: filter === key
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : darkMode 
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)',
                color: filter === key 
                  ? 'white' 
                  : darkMode ? '#e0e0e0' : '#666',
                boxShadow: filter === key ? '0 3px 15px rgba(102, 126, 234, 0.4)' : 'none'
              }}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div style={{
            padding: '20px',
            background: darkMode 
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(255,255,255,0.9)',
            borderRadius: '20px',
            marginBottom: '30px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: darkMode ? '#e0e0e0' : '#333'
              }}>
                Progress
              </span>
              <span style={{
                fontSize: '14px',
                color: darkMode ? '#a0a0a0' : '#666'
              }}>
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                transition: 'width 0.5s ease',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        )}

        {/* Todo List */}
        <div style={{ marginBottom: '30px' }}>
          {visibleTodos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: darkMode ? '#a0a0a0' : 'rgba(255,255,255,0.8)'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📝</div>
              <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                No tasks yet
              </p>
              <p style={{ fontSize: '14px' }}>
                Add a task above to get started!
              </p>
            </div>
          ) : (
            visibleTodos
              .sort((a, b) => a.completed - b.completed || new Date(b.createdAt) - new Date(a.createdAt))
              .map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  darkMode={darkMode}
                  onToggle={() => toggleComplete(todo.id)}
                  onEdit={(newText) => editTodo(todo.id, newText)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

const TodoItem = ({ todo, darkMode, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onEdit(editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '20px',
        marginBottom: '15px',
        background: todo.completed 
          ? darkMode 
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.6)'
          : darkMode
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.9)',
        borderRadius: '16px',
        boxShadow: isHovered && !todo.completed
          ? '0 10px 30px rgba(0,0,0,0.2)'
          : '0 5px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        opacity: todo.completed ? 0.7 : 1,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Drag Handle */}
        <div style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          color: darkMode ? '#666' : '#999',
          cursor: 'grab'
        }}>
          <GripVertical size={16} />
        </div>

        {/* Checkbox */}
        <button
          onClick={onToggle}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: todo.completed 
              ? 'none'
              : `2px solid ${darkMode ? '#666' : '#ccc'}`,
            background: todo.completed
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!todo.completed) {
              e.target.style.borderColor = '#667eea';
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!todo.completed) {
              e.target.style.borderColor = darkMode ? '#666' : '#ccc';
              e.target.style.background = 'transparent';
            }
          }}
        >
          {todo.completed && <Check size={14} color="white" />}
        </button>

        {/* Task Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #667eea',
                borderRadius: '8px',
                fontSize: '16px',
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                color: darkMode ? 'white' : '#333',
                outline: 'none'
              }}
              autoFocus
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: todo.completed 
                  ? '#888'
                  : darkMode ? '#e0e0e0' : '#333',
                textDecoration: todo.completed ? 'line-through' : 'none',
                transition: 'all 0.2s ease'
              }}>
                {todo.text}
              </span>
              <span style={{
                fontSize: '12px',
                color: darkMode ? '#888' : '#999',
                marginLeft: '15px'
              }}>
                {timeAgo(todo.createdAt)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '5px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease'
        }}>
          <button
            onClick={() => {
              setEditText(todo.text);
              setIsEditing(true);
            }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: 'transparent',
              color: darkMode ? '#888' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
              e.target.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = darkMode ? '#888' : '#666';
            }}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this task?")) {
                onDelete();
              }
            }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: 'transparent',
              color: darkMode ? '#888' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = darkMode ? '#888' : '#666';
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;