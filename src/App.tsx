import React from 'react';

import './App.css';
import Game from './phaser/Game';

export default function App() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        zIndex: 0,
      }}
    >
      <div id='game'>
        <Game />
      </div>
    </div>
  );
}
