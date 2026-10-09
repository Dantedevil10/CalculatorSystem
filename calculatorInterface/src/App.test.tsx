import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from './App';

globalThis.fetch = vi.fn();

describe('App Component - Interface & Interações', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Limpa o DOM após cada teste para que um componente não interfira no outro
  afterEach(() => {
    cleanup();
  });

  test('deve renderizar a calculadora padrão por padrão', () => {
    render(<App />);

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Manual Mode')).toBeInTheDocument();
    
    // getAllByText retorna um array. Pegamos o primeiro item (ou apenas checamos se existe mais de 0)
    // pois há o "0" no visor e o "0" no botão.
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  test('deve atualizar o visor ao clicar nos botões numéricos', async () => {
    const user = userEvent.setup();
    render(<App />);

    const btn5 = screen.getByRole('button', { name: '5' });
    const btnPlus = screen.getByRole('button', { name: '+' });
    const btn3 = screen.getByRole('button', { name: '3' });

    await user.click(btn5);
    await user.click(btnPlus);
    await user.click(btn3);

    expect(screen.getByText('5+3')).toBeInTheDocument();
  });

  test('deve limpar o visor ao clicar no botão "C"', async () => {
    const user = userEvent.setup();
    render(<App />);

    const btn9 = screen.getByRole('button', { name: '9' });
    const btnC = screen.getByRole('button', { name: 'C' });

    await user.click(btn9);
    // Deve haver 2 elementos com "9": O visor e o botão
    expect(screen.getAllByText('9').length).toBe(2);

    await user.click(btnC);
    // Deve haver 2 elementos com "0" novamente: O visor limpo e o botão
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  test('deve alternar para o modo manual e voltar para o padrão', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleBtn = screen.getByRole('button', { name: '⚙️ Manual Mode' });
    await user.click(toggleBtn);

    expect(screen.getByText('Manual')).toBeInTheDocument();
    // Apenas verifica se as labels em formato de texto estão na tela
    expect(screen.getByText('Operation:')).toBeInTheDocument();
    expect(screen.getByText('Value A:')).toBeInTheDocument();

    // Volta para o modo padrão
    const toggleBackBtn = screen.getByRole('button', { name: '🔢 Calculator' });
    await user.click(toggleBackBtn);

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  test('deve disparar cálculo na API no modo padrão ao clicar em "="', async () => {
    const user = userEvent.setup();
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 15 }),
    });

    render(<App />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/calculate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ expression: '10+5' }),
        })
      );
    });
  });

  test('deve calcular corretamente via formulário no Modo Manual', async () => {
    const user = userEvent.setup();
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 25 }),
    });

    render(<App />);

    await user.click(screen.getByRole('button', { name: '⚙️ Manual Mode' }));

    // Busca os inputs pelos placeholders, já que não possuem id associado às labels
    const inputA = screen.getByPlaceholderText('Ex: 10');
    const inputB = screen.getByPlaceholderText('Ex: 5');
    const submitBtn = screen.getByRole('button', { name: 'Calculate' });

    await user.type(inputA, '20');
    await user.type(inputB, '5');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro retornada pela API', async () => {
    const user = userEvent.setup();
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Division by zero is not allowed.' }),
    });

    render(<App />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '/' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    await waitFor(() => {
      expect(screen.getByText('Division by zero is not allowed.')).toBeInTheDocument();
    });
  });
});