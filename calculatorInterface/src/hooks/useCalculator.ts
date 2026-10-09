import { useState } from 'react';

interface CalculatePayload {
  expression?: string;
  operation?: string;
  a?: number;
  b?: number;
}

export function useCalculator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (payload: CalculatePayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request error');
      }

      return data.result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { calculate, loading, error, setError };
}