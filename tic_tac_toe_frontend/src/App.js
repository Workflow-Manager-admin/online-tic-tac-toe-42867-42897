import React, { useState } from 'react';
import './App.css';

// Color palette
const PRIMARY_COLOR = '#1976d2';
const SECONDARY_COLOR = '#ffffff';
const ACCENT_COLOR = '#f44336';

// Game helpers
const initialBoard = () => Array(9).fill(null);

const getNextPlayer = (board) => {
  const xCount = board.filter((c) => c === 'X').length;
  const oCount = board.filter((c) => c === 'O').length;
  return xCount > oCount ? 'O' : 'X';
};

const getWinner = (board) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diags
  ];
  for (let [a,b,c] of lines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
};

const isDraw = (board) => {
  return board.every((cell) => cell !== null) && !getWinner(board);
};

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App component for Tic Tac Toe Game.
   * UI and logic for a 2-player game, responsive and minimalistic as specified.
   */
  const [board, setBoard] = useState(initialBoard());
  const winner = getWinner(board);
  const draw = isDraw(board);
  const currentPlayer = getNextPlayer(board);

  // PUBLIC_INTERFACE
  const handleCellClick = (idx) => {
    if (board[idx] || winner) return;
    const boardCopy = board.slice();
    boardCopy[idx] = currentPlayer;
    setBoard(boardCopy);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => setBoard(initialBoard());

  // Render helpers
  const renderStatus = () => {
    if (winner)
      return (
        <span data-testid="winner-msg" style={{ color: ACCENT_COLOR, fontWeight: 700 }}>
          Player {winner} wins!
        </span>
      );
    if (draw)
      return (
        <span data-testid="draw-msg" style={{ color: PRIMARY_COLOR, fontWeight: 700 }}>
          It's a draw!
        </span>
      );
    return (
      <span data-testid="next-msg" style={{ color: PRIMARY_COLOR }}>
        Player {currentPlayer}'s turn
      </span>
    );
  };

  return (
    <div className="ttt-root">
      <main className="ttt-container">
        <h2 className="ttt-title">Tic Tac Toe</h2>
        <div className="ttt-status">
          {renderStatus()}
        </div>
        <Board
          board={board}
          onCellClick={handleCellClick}
          winner={winner}
        />
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          aria-label="Restart Game"
        >
          Restart
        </button>
        <footer className="ttt-footer">
          <span style={{ fontSize: 13, color: "#858585" }}>
            Modern minimal React app &mdash; <a href="https://reactjs.org/" style={{ color: PRIMARY_COLOR }}>React</a>
          </span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winner }) {
  /**
   * Renders the game board as a 3x3 grid.
   * @param {object} props
   *   board - array[9]: 'X', 'O', or null
   *   onCellClick - function(cell index)
   *   winner - winner symbol or null
   */
  return (
    <div className="ttt-board" role="grid">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          highlight={winner && isWinningCell(board, idx)}
          onClick={() => onCellClick(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Cell({ value, onClick, highlight }) {
  /**
   * Renders an individual Tic Tac Toe cell (button).
   * @param {object} props
   *   value: 'X', 'O', or null
   *   onClick: click handler
   *   highlight: whether to highlight as winning cell
   */
  const style = highlight
    ? {
        background: '#ffe0e6',
        borderColor: ACCENT_COLOR,
        color: ACCENT_COLOR,
        fontWeight: 700,
      }
    : value === 'X'
    ? {
        color: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
      }
    : value === 'O'
    ? {
        color: ACCENT_COLOR,
        borderColor: ACCENT_COLOR,
      }
    : {};

  return (
    <button
      className="ttt-cell"
      style={style}
      onClick={onClick}
      aria-label={value ? value : 'empty'}
      tabIndex={0}
      disabled={value !== null || highlight !== undefined}
      data-testid="ttt-cell"
    >
      {value}
    </button>
  );
}

// Returns if the cell at index is part of the winning line.
function isWinningCell(board, idx) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c] &&
      [a, b, c].includes(idx)
    ) {
      return true;
    }
  }
  return false;
}

export default App;
