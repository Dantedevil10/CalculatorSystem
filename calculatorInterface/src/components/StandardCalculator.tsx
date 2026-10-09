import { useState } from 'react';
import { useCalculator } from '../hooks/useCalculator';

export function StandardCalculator() {
  const [display, setDisplay] = useState<string>('0');
  const { calculate, loading, error, setError } = useCalculator();

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
    setError(null);
  };

  const handleDelete = () => {
    if (display.length === 1 || display === 'Erro') {
      setDisplay('0');
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  const handleCalculateStandard = async () => {
    let formattedExpression = display.replace(/√/g, 'sqrt');

    const openParentheses = (formattedExpression.match(/\(/g) || []).length;
    const closeParentheses = (formattedExpression.match(/\)/g) || []).length;

    if (openParentheses > closeParentheses) {
      formattedExpression += ')'.repeat(openParentheses - closeParentheses);
    }

    const result = await calculate({ expression: formattedExpression });
    if (result !== null) {
      setDisplay(String(result));
    }
  };

  return (
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
  );
}