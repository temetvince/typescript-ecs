import { ReactP5Wrapper } from '@p5-wrapper/react';
import { FC } from 'react';
import { GameSetup } from './GameSetup';
import { EntityComponentSystem } from './EntityComponentSystem/EntityComponentSystem';
import type p5 from 'p5';
import React from 'react';

const PARENT_DIV = 'ecs-demo';

/**
 * The main application component.
 *
 * @returns The React component rendering the p5.js sketch.
 */
/**
 * A React functional component that renders a p5.js sketch for a game
 * using an Entity-Component-System (ECS) architecture. The component
 * dynamically adjusts the canvas size to fit its parent container and
 * supports transparency customization.
 *
 * @param {Object} props - The component props.
 * @param {number} props.transparency - A value between 0 and 1 that determines
 * the transparency level of the game elements. 0 is fully transparent, 1 is fully opaque.
 *
 * @returns {JSX.Element} A div container with a p5.js sketch rendered inside.
 */
const ECSDemo: FC<{ transparency?: number }> = ({
  transparency = 1,
}): React.JSX.Element => {
  /**
   * The p5.js sketch that renders the game.
   *
   * @param p - The p5.js instance.
   */
  const sketch = (p: p5) => {
    let ecs: EntityComponentSystem | null = null;

    p.setup = () => {
      const canvasContainer = document.getElementById(PARENT_DIV);
      const canvasParent = canvasContainer?.parentNode as HTMLElement;

      p.createCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
      ecs = GameSetup(transparency);
    };

    p.draw = () => {
      if (ecs) {
        p.clear();
        ecs.update(p);
      }
    };

    p.windowResized = () => {
      const canvasContainer = document.getElementById(PARENT_DIV);
      const canvasParent = canvasContainer?.parentNode as HTMLElement;
      p.resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
    };
  };

  return (
    <div
      id={PARENT_DIV}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
};

export default ECSDemo;
