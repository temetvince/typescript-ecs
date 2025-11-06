import { System } from '../EntityComponentSystem/System';
import { Position } from '../Components/Position';
import { Velocity } from '../Components/Velocity';
import { Boid } from '../Components/Boid';
import { P5CanvasInstance } from '@p5-wrapper/react';
import { Entity } from '../EntityComponentSystem/EntityComponentSystem';

/**
 * The BoundaryCollision system handles collisions of boids with the canvas boundaries,
 * wrapping them around to the opposite side of the canvas.
 */
export class BoundaryCollision extends System {
  componentsRequired = new Set<typeof Position | typeof Velocity | typeof Boid>(
    [Position, Velocity, Boid],
  );
  public dirtyComponents = new Set<typeof Velocity>();

  /**
   * Updates the system by handling boundary wrapping for all entities.
   *
   * @param entities - The set of entities to be updated.
   * @param p5 - The p5.js instance used for boundary detection.
   */
  update(entities: Set<Entity>, p5: P5CanvasInstance): void {
    for (const entity of entities) {
      const components = this.ecs.getComponents(entity);
      if (!components) continue;

      const position = components.get(Position);
      const velocity = components.get(Velocity);

      if (position && velocity) {
        this.applyBoundaryWrapping(position, velocity, p5);
      }
    }
  }

  /**
   * Wraps the entity around the canvas boundaries.
   *
   * @param position - The Position component of the entity.
   * @param velocity - The Velocity component of the entity.
   * @param p5 - The p5.js instance used for boundary detection.
   */
  private applyBoundaryWrapping(
    position: Position,
    velocity: Velocity,
    p5: P5CanvasInstance,
  ): void {
    if (position.getX() < 0) {
      position.setX(p5.width);
    } else if (position.getX() > p5.width) {
      position.setX(0);
    }

    if (position.getY() < 0) {
      position.setY(p5.height);
    } else if (position.getY() > p5.height) {
      position.setY(0);
    }
  }
}
