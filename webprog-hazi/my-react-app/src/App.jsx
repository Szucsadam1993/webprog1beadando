import { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList.jsx';
import ColorPicker from './components/ColorPicker.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('todo');

  return (
    <div className="app-container">
      <h2>React Alkalmazások</h2>
      <div className="tabs">
        <button
          className={activeTab === 'todo' ? 'active' : ''}
          onClick={() => setActiveTab('todo')}
        >
          Teendőlista
        </button>
        <button
          className={activeTab === 'color' ? 'active' : ''}
          onClick={() => setActiveTab('color')}
        >
          Színválasztó
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'todo' ? <TodoList /> : <ColorPicker />}
      </div>
    </div>
  );
}