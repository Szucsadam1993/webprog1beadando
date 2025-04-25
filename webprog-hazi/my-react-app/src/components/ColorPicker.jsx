import { useState } from 'react';
import './ColorPicker.css';

function ColorDisplay({ color }) {
  const [copied, setCopied] = useState(false);

  const copyColor = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="color-display">
      <p>Kiválasztott szín: {color}</p>
      <button onClick={copyColor}>
        {copied ? 'Másolva!' : 'Másolás'}
      </button>
    </div>
  );
}

export default function ColorPicker() {
  const [color, setColor] = useState('#ffffff');

  return (
    <div className="color-picker">
      <h3>Színválasztó</h3>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <div className="color-preview" style={{ backgroundColor: color }}></div>
      <ColorDisplay color={color} />
    </div>
  );
}