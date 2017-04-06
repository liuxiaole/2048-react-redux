import React from 'react';
import './GameOver.css';

export default function GameOver ({onNewGame}) {
  return <div className="game-over">
    <h1 className="title">Game Over!</h1>
    <button onClick={onNewGame}>Try Again</button>
  </div>;
}
