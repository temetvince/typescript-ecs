import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';
import React, { useEffect } from 'react';
import { GameSetup } from './GameSetup';
import { EntityComponentSystem } from './EntityComponentSystem/EntityComponentSystem';

/**
 * The p5.js sketch that renders the game.
 *
 * @param p5 - The p5.js instance.
 */
const sketch: Sketch = (p5) => {
  let ecs: EntityComponentSystem | null = null;

  p5.setup = () => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.style('display', 'block');
    ecs = GameSetup();
  };

  p5.draw = () => {
    if (ecs) {
      p5.background(0); // Clear the background each frame
      ecs.update(p5);
    }
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };
};

/**
 * The main application component.
 *
 * @returns The React component rendering the p5.js sketch.
 */
export function App() {
  useEffect(() => {
    // Add global styles to ensure proper layout
    const style = document.createElement('style');
    style.innerHTML = `
         body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
         }
      `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <ReactP5Wrapper sketch={sketch} />;
}

export default App;
