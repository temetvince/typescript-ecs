import { P5CanvasInstance } from '@p5-wrapper/react';
import { Position } from '../Components/Position';
import { Color } from '../Components/Color';
import { System } from '../EntityComponentSystem/System';
import { Entity } from '../EntityComponentSystem/EntityComponentSystem';

/**
 * The Display system is responsible for rendering entities with a Position and Color component.
 * It uses p5.js to draw points representing the entities on the canvas.
 */
export class Display extends System {
  componentsRequired = new Set<typeof Position | typeof Color>([
    Position,
    Color,
  ]);

  /**
   * Updates the Display system, rendering all entities with a Position and Color component.
   *
   * @param entities - The set of entities to be updated and rendered.
   * @param p5 - The p5.js instance used for rendering.
   */
  update(entities: Set<Entity>, p5: P5CanvasInstance): void {
    for (const entity of entities) {
      const components = this.ecs.getComponents(entity);
      if (!components) continue;

      const position = components.get(Position);
      const color = components.get(Color);

      if (position && color) {
        this.renderEntity(p5, position, color);
      }
    }
  }

  /**
   * Renders an individual entity on the canvas.
   *
   * @param p5 - The p5.js instance used for rendering.
   * @param position - The Position component of the entity.
   * @param color - The Color component of the entity.
   */
  private renderEntity(
    p5: P5CanvasInstance,
    position: Position,
    color: Color,
  ): void {
    p5.stroke(color.getColor());
    p5.strokeWeight(10);
    p5.point(position.getX(), position.getY());
  }
}
