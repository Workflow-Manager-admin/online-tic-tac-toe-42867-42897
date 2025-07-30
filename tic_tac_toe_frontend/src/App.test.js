import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders header and status', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByTestId('next-msg')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Restart/i })).toBeInTheDocument();
});

test('can play a complete game and detect X winner', () => {
  render(<App />);
  const cells = screen.getAllByTestId('ttt-cell');
  // X | X | X
  // O | O | 
  //   |   | 
  fireEvent.click(cells[0]); // X
  fireEvent.click(cells[3]); // O
  fireEvent.click(cells[1]); // X
  fireEvent.click(cells[4]); // O
  fireEvent.click(cells[2]); // X - X wins
  
  expect(screen.getByTestId('winner-msg')).toHaveTextContent(/Player X wins/i);
  // Additional moves after win should not have effect
  fireEvent.click(cells[5]);
  expect(cells[5]).toHaveTextContent('');
});

test('can declare draw', () => {
  render(<App />);
  const cells = screen.getAllByTestId('ttt-cell');
  // X|O|X
  // X|O|O
  // O|X|X
  const moves = [0,1,2,4,3,6,5,7,8]; // A draw
  moves.forEach((i, turn) => fireEvent.click(cells[i]));
  expect(screen.getByTestId('draw-msg')).toHaveTextContent(/draw/i);
});

test('reset button clears game', () => {
  render(<App />);
  const cells = screen.getAllByTestId('ttt-cell');
  fireEvent.click(cells[0]); // X
  fireEvent.click(cells[1]); // O
  fireEvent.click(cells[2]); // X
  fireEvent.click(cells[3]); // O
  const resetBtn = screen.getByRole('button', { name: /Restart/i });
  fireEvent.click(resetBtn);
  cells.forEach(cell => expect(cell).toHaveTextContent(''));
});
