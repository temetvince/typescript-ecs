import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import BootScene from './scenes/boot';
import MainScene from './scenes/main';

interface GameProps {
  config?: Phaser.Types.Core.GameConfig;
}

const Game: React.FC<GameProps> = ({ config }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parentRef.current) return;

    const defaultConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: parentRef.current,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 0 } },
      },
      scene: [BootScene, MainScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game({ ...defaultConfig, ...config });
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [config]);

  return (
    <div
      ref={parentRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1,
      }}
    />
  );
};

export default Game;
