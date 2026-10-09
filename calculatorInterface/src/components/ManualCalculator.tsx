import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useCalculator } from '../hooks/useCalculator';

export function ManualCalculator() {
  const [numberA, setNumberA] = useState<string>('');
  const [numberB, setNumberB] = useState<string>('');
  const [operation, setOperation] = useState<string>('add');
  const [result, setResult] = useState<string | number | null>(null);
  
  const { calculate, loading, error, setError } = useCalculator();

  const handleCalculateManual = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);

    const calcResult = await calculate({
      operation,
      a: Number(numberA),
      b: operation === 'sqrt' ? undefined : Number(numberB),
    });

    if (calcResult !== null) {
      setResult(calcResult);
    }
  };

  return (
    <form className="manual-calculator" onSubmit={handleCalculateManual}>
      <div className="form-group">
        <label>Operation:</label>
        <select value={operation} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setOperation(e.target.value);
          setError(null);
        }}>
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
  );
}