import { useState } from 'react';
import { StandardCalculator } from './components/StandardCalculator';
import { ManualCalculator } from './components/ManualCalculator';
import './App.css';

type Mode = 'standard' | 'manual';

export default function App() {
  const [mode, setMode] = useState<Mode>('standard');

  const toggleMode = () => {
    setMode((prev) => (prev === 'standard' ? 'manual' : 'standard'));
  };

  return (
    <div className="app-container">
      <div className="calculator-card">
        <div className="header-bar">
          <button className="mode-toggle-btn" onClick={toggleMode}>
            {mode === 'standard' ? '⚙️ Manual Mode' : '🔢 Calculator'}
          </button>
          <span className="app-title">{mode === 'standard' ? 'Default' : 'Manual'}</span>
        </div>

        {mode === 'standard' ? <StandardCalculator /> : <ManualCalculator />}
        
      </div>
    </div>
  );
}