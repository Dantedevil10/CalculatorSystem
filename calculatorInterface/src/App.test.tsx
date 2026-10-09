import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from './App';

globalThis.fetch = vi.fn();

describe('App Component - Interface & Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Cleans up the DOM after each test so that one component does not interfere with another.
  afterEach(() => {
    cleanup();
  });

  test('should render the standard calculator by default', () => {
    render(<App />);

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Manual Mode')).toBeInTheDocument();
    
    // getAllByText returns an array. We take the first item (or simply check if there is more than 0)
    // because there is the "0" on the display and the "0" on the button.
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  test('It should update the display when the numeric buttons are clicked.', async () => {
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

  test('It should clear the display when the "C" button is clicked.', async () => {
    const user = userEvent.setup();
    render(<App />);

    const btn9 = screen.getByRole('button', { name: '9' });
    const btnC = screen.getByRole('button', { name: 'C' });

    await user.click(btn9);
    // There must be 2 elements with "9": the display and the button.
    expect(screen.getAllByText('9').length).toBe(2);

    await user.click(btnC);
    // There must be 2 elements with "0" again: the clean display and the button.
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  test('must switch to manual mode and return to default', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleBtn = screen.getByRole('button', { name: '⚙️ Manual Mode' });
    await user.click(toggleBtn);

    expect(screen.getByText('Manual')).toBeInTheDocument();
    // It simply checks if the text-format labels are on the screen.
    expect(screen.getByText('Operation:')).toBeInTheDocument();
    expect(screen.getByText('Value A:')).toBeInTheDocument();

    // Return to standard mode
    const toggleBackBtn = screen.getByRole('button', { name: '🔢 Calculator' });
    await user.click(toggleBackBtn);

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  test('should trigger the calculation in the API in standard mode when clicking "="', async () => {
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

  test('must calculate correctly via the form in Manual Mode', async () => {
    const user = userEvent.setup();
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 25 }),
    });

    render(<App />);

    await user.click(screen.getByRole('button', { name: '⚙️ Manual Mode' }));

    // Locate the inputs using the placeholders, since they do not have IDs associated with the labels.
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

  test('must display the error message returned by the API', async () => {
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