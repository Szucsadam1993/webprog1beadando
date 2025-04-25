import { useState } from 'react';
import './TodoList.css';

function TodoItem({ todo, index, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(index)}
      />
      <div className="todo-details">
        <span className="todo-text">{todo.text}</span>
        {todo.date && <p className="todo-date">Határidő: {todo.date}</p>}
        {todo.note && <p className="todo-note">Megjegyzés: {todo.note}</p>}
      </div>
      <button onClick={() => onDelete(index)}>Törlés</button>
    </li>
  );
}

export default function TodoList() {
  const [todos, setTodos] = useState([
    {
      text: 'Dokumentáció készítése',
      completed: false,
      date: '2025-04-25',
      note: 'Sürgős határidő',
    },
    {
      text: 'Kód feltöltése GitHub-ra',
      completed: false,
      date: '2025-04-26',
      note: 'Ellenőrizni a commit üzeneteket',
    },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newNote, setNewNote] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    setTodos([
      ...todos,
      {
        text: newTodo,
        completed: false,
        date: newDate || '', // Ha nincs dátum megadva, üres string
        note: newNote.trim() || '',
      },
    ]);
    setNewTodo('');
    setNewDate('');
    setNewNote('');
  };

  const toggleTodo = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-list">
      <h3>Teendőlista</h3>
      <form onSubmit={addTodo}>
        <div className="form-group">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Új teendő..."
            required
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            placeholder="Határidő (opcionális)..."
          />
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Megjegyzés (opcionális)..."
          />
          <button type="submit">Hozzáadás</button>
        </div>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <TodoItem
            key={index}
            todo={todo}
            index={index}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}