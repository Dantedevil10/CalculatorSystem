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
  const [manualA, setManualA] = useState<string>('');
  const [manualB, setManualB] = useState<string>('');
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

  // Dispara a requisição de expressão para a API (Modo Padrão)
  const handleCalculateStandard = async () => {
    setLoading(true);
    setError(null);
    try {
      let formattedExpression = display.replace(/√/g, 'sqrt');

      // Conta parênteses abertos e fechados
      const openParentheses = (formattedExpression.match(/\(/g) || []).length;
      const closeParentheses = (formattedExpression.match(/\)/g) || []).length;

      // Adiciona os parênteses faltantes ao final
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
        throw new Error(data.error || 'Erro na requisição');
      }

      setResult(data.result);
      setDisplay(String(data.result));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dispara a requisição manual com operação e valores (Modo Manual)
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
          a: Number(manualA),
          b: operation === 'sqrt' ? undefined : Number(manualB),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar cálculo');
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
            {mode === 'standard' ? '⚙️ Modo Manual' : '🔢 Calculadora'}
          </button>
          <span className="app-title">{mode === 'standard' ? 'Padrão' : 'Manual'}</span>
        </div>

        {mode === 'standard' ? (
          /* MODO CALCULADORA PADRÃO COM TODAS AS OPERAÇÕES */
          <div className="standard-calculator">
            <div className="display-container">
              {error && <div className="error-badge">{error}</div>}
              <div className="display-text">{loading ? 'Calculando...' : display}</div>
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
          /* MODO INPUT MANUAL */
          <form className="manual-calculator" onSubmit={handleCalculateManual}>
            <div className="form-group">
              <label>Operação:</label>
              <select value={operation} onChange={(e: ChangeEvent<HTMLSelectElement>) => setOperation(e.target.value)}>
                <option value="add">Adição (+)</option>
                <option value="subtract">Subtração (-)</option>
                <option value="multiply">Multiplicação (*)</option>
                <option value="divide">Divisão (/)</option>
                <option value="power">Potência (^)</option>
                <option value="sqrt">Raiz Quadrada (√)</option>
                <option value="percentage">Porcentagem (%)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Valor A:</label>
              <input
                type="number"
                step="any"
                required
                value={manualA}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setManualA(e.target.value)}
                placeholder="Ex: 10"
              />
            </div>

            {operation !== 'sqrt' && (
              <div className="form-group">
                <label>Valor B:</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={manualB}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setManualB(e.target.value)}
                  placeholder="Ex: 5"
                />
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Processando...' : 'Calcular'}
            </button>

            {error && <div className="error-box">{error}</div>}

            {result !== null && (
              <div className="result-box">
                <span>Resultado:</span>
                <strong>{result}</strong>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}