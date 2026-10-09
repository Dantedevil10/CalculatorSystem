import { useState, type ChangeEvent, type FormEvent } from 'react';
import './App.css';

type Mode = 'standard' | 'manual';

export default function App() {
  const [mode, setMode] = useState<Mode>('standard');
  const [display, setDisplay] = useState<string>('0');
  const [result, setResult] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Manual mode states
  const [numberA, setNumberA] = useState<string>('');
  const [numberB, setNumberB] = useState<string>('');
  const [operation, setOperation] = useState<string>('add');

  const toggleMode = () => {
    setMode((prev) => (prev === 'standard' ? 'manual' : 'standard'));
    setDisplay('0');
    setResult(null);
    setError(null);
  };

  const handleButtonClick = (value: string) => {
    setError(null);
    if (display === '0' || display === 'Erro') {
      setDisplay(value);
    } else {
      setDisplay((prev) => prev + value);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setResult(null);
    setError(null);
  };

  const handleDelete = () => {
    if (display.length === 1 || display === 'Erro') {
      setDisplay('0');
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  // Triggers the expression request to the API (Standard Mode)
  const handleCalculateStandard = async () => {
    setLoading(true);
    setError(null);
    try {
      let formattedExpression = display.replace(/√/g, 'sqrt');

      // Counts open and closed parentheses
      const openParentheses = (formattedExpression.match(/\(/g) || []).length;
      const closeParentheses = (formattedExpression.match(/\)/g) || []).length;

      // Adds the missing parentheses at the end.
      if (openParentheses > closeParentheses) {
        formattedExpression += ')'.repeat(openParentheses - closeParentheses);
      }

      const response = await fetch('http://localhost:3000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: formattedExpression }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request error');
      }

      setResult(data.result);
      setDisplay(String(data.result));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Triggers the manual request with operation and values ​​(Manual Mode)
  const handleCalculateManual = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          a: Number(numberA),
          b: operation === 'sqrt' ? undefined : Number(numberB),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error processing calculation');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

        {mode === 'standard' ? (
          /* Standard calculator mode with all operations */
          <div className="standard-calculator">
            <div className="display-container">
              {error && <div className="error-badge">{error}</div>}
              <div className="display-text">{loading ? 'Calculating...' : display}</div>
            </div>

            <div className="keypad">
              <button className="btn btn-action" onClick={handleClear}>C</button>
              <button className="btn btn-action" onClick={handleDelete}>DEL</button>
              <button className="btn btn-action" onClick={() => handleButtonClick('(')}>(</button>
              <button className="btn btn-action" onClick={() => handleButtonClick(')')}>)</button>

              {/* Botões das operações avançadas adicionados */}
              <button className="btn btn-op" onClick={() => handleButtonClick('√(')}>√</button>
              <button className="btn btn-op" onClick={() => handleButtonClick('^')}>^</button>
              <button className="btn btn-op" onClick={() => handleButtonClick('%')}>%</button>
              <button className="btn btn-op" onClick={() => handleButtonClick('/')}>/</button>

              <button className="btn" onClick={() => handleButtonClick('7')}>7</button>
              <button className="btn" onClick={() => handleButtonClick('8')}>8</button>
              <button className="btn" onClick={() => handleButtonClick('9')}>9</button>
              <button className="btn btn-op" onClick={() => handleButtonClick('*')}>*</button>

              <button className="btn" onClick={() => handleButtonClick('4')}>4</button>
              <button className="btn" onClick={() => handleButtonClick('5')}>5</button>
              <button className="btn" onClick={() => handleButtonClick('6')}>6</button>
              <button className="btn btn-op" onClick={() => handleButtonClick('-')}>-</button>

              <button className="btn" onClick={() => handleButtonClick('1')}>1</button>
              <button className="btn" onClick={() => handleButtonClick('2')}>2</button>
              <button className="btn" onClick={() => handleButtonClick('3')}>3</button>
              <button className="btn btn-op" onClick={() => handleButtonClick('+')}>+</button>

              <button className="btn" onClick={() => handleButtonClick('0')}>0</button>
              <button className="btn" onClick={() => handleButtonClick('.')}>.</button>
              <button className="btn btn-equals grid-span-2" onClick={handleCalculateStandard}>=</button>
            </div>
          </div>
        ) : (
          /* MANUAL INPUT MODE */
          <form className="manual-calculator" onSubmit={handleCalculateManual}>
            <div className="form-group">
              <label>Operation:</label>
              <select value={operation} onChange={(e: ChangeEvent<HTMLSelectElement>) => setOperation(e.target.value)}>
                <option value="add">Addition (+)</option>
                <option value="subtract">Subtraction (-)</option>
                <option value="multiply">Multiplication (*)</option>
                <option value="divide">Division (/)</option>
                <option value="power">Power (^)</option>
                <option value="sqrt">Square Root (√)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Value A:</label>
              <input
                type="number"
                step="any"
                required
                value={numberA}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumberA(e.target.value)}
                placeholder="Ex: 10"
              />
            </div>

            {operation !== 'sqrt' && (
              <div className="form-group">
                <label>Value B:</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={numberB}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNumberB(e.target.value)}
                  placeholder="Ex: 5"
                />
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Processing...' : 'Calculate'}
            </button>

            {error && <div className="error-box">{error}</div>}

            {result !== null && (
              <div className="result-box">
                <span>Result:</span>
                <strong>{result}</strong>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}