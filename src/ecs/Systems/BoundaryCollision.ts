import Phaser from 'phaser';
import { System } from '../EntityComponentSystem/System';
import { Position } from '../Components/Position';
import { Velocity } from '../Components/Velocity';
import { Boid } from '../Components/Boid';
import Entity from '../EntityComponentSystem/Entity';

/**
 * The BoundaryCollision system handles collisions of boids with the canvas boundaries,
 * wrapping them around to the opposite side of the canvas.
 */
export class BoundaryCollision extends System {
  componentsRequired = new Set<typeof Position | typeof Velocity | typeof Boid>(
    [Position, Velocity, Boid],
  );
  public dirtyComponents = new Set<typeof Velocity>([Velocity]);

  /**
   * Updates the system by handling boundary wrapping for all entities.
   *
   * @param entities - The set of entities to be updated.
   * @param context - Phaser.Scene (or similar) used for boundary detection.
   */
  update(entities: Set<Entity>, context?: unknown): void {
    const scene = context as Phaser.Scene | undefined;
    if (!scene) return;

    // Prefer the scene scale manager; fallback to canvas or window size if necessary.
    const width =
      scene.scale.width || scene.sys.canvas.width || window.innerWidth;
    const height =
      scene.scale.height || scene.sys.canvas.height || window.innerHeight;

    for (const entity of entities) {
      const components = this.ecs.getComponents(entity);
      if (!components) continue;

      const position = components.get(Position);
      const velocity = components.get(Velocity);

      if (position && velocity) {
        this.applyBoundaryWrapping(position, velocity, width, height);
      }
    }
  }

  /**
   * Wraps the entity around the canvas boundaries.
   *
   * @param position - The Position component of the entity.
   * @param velocity - The Velocity component of the entity.
   * @param width - Width of the render area to use for wrapping.
   * @param height - Height of the render area to use for wrapping.
   */
  private applyBoundaryWrapping(
    position: Position,
    velocity: Velocity,
    width: number,
    height: number,
  ): void {
    if (position.getX() < 0) {
      position.setX(width);
    } else if (position.getX() > width) {
      position.setX(0);
    }

    if (position.getY() < 0) {
      position.setY(height);
    } else if (position.getY() > height) {
      position.setY(0);
    }
  }
}
