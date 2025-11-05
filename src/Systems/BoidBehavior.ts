import { Entity } from '../EntityComponentSystem/EntityComponentSystem';
import { System } from '../EntityComponentSystem/System';
import { Position } from '../Components/Position';
import { Velocity } from '../Components/Velocity';
import { Boid } from '../Components/Boid';
import { Group } from '../Components/Group';
import { P5CanvasInstance } from '@p5-wrapper/react';
import { getNeighbors } from '../Utils';
import p5 from 'p5';

const PERCEPTION_RADIUS = 100;
const MAX_FORCE = 0.67;
const MAX_SPEED = 2;
const REPULSION_FORCE = 2; // Constant repulsion force between different groups

/**
 * The BoidBehavior system is responsible for applying boid behaviors (alignment, cohesion, separation),
 * and handling boundary collisions.
 */
export class BoidBehavior extends System {
  componentsRequired = new Set<
    typeof Position | typeof Velocity | typeof Boid | typeof Group
  >([Position, Velocity, Boid, Group]);
  public dirtyComponents = new Set<typeof Velocity>([Velocity]);

  /**
   * Updates the BoidBehavior system, applying behaviors to all boids.
   *
   * @param entities - The set of entities to be updated.
   * @param p5 - The p5.js instance used for rendering and vector calculations.
   */
  update(entities: Set<Entity>, p5: P5CanvasInstance): void {
    for (const entity of entities) {
      const components = this.ecs.getComponents(entity);
      if (!components) continue;

      const position = components.get(Position);
      const velocity = components.get(Velocity);
      const group = components.get(Group);

      if (!position || !velocity || !group) {
        console.error(`Entity ${entity} is missing required components.`);
        continue;
      }

      const neighbors = getNeighbors(
        entity,
        entities,
        position,
        PERCEPTION_RADIUS,
      );
      if (neighbors.length === 0) continue;

      this.applyBoidBehaviors(
        p5,
        position,
        velocity,
        neighbors,
        group,
        MAX_FORCE,
        MAX_SPEED,
      );
    }
  }

  /**
   * Applies the Boids rules (separation, alignment, cohesion) to the boid's velocity.
   *
   * @param p5 - Instance of p5.js for vector calculations.
   * @param position - The position of the current boid.
   * @param velocity - The velocity of the current boid.
   * @param neighbors - Array of neighboring boid entities.
   * @param group - The group of the current boid.
   * @param maxForce - The maximum steering force.
   * @param maxSpeed - The maximum speed.
   */
  private applyBoidBehaviors(
    p5: P5CanvasInstance,
    position: Position,
    velocity: Velocity,
    neighbors: Entity[],
    group: Group,
    maxForce: number,
    maxSpeed: number,
  ): void {
    const alignment = p5.createVector(0, 0);
    const cohesion = p5.createVector(0, 0);
    const separation = p5.createVector(0, 0);
    const repulsion = p5.createVector(0, 0);

    neighbors.forEach((neighbor) => {
      const components = this.ecs.getComponents(neighbor);
      if (!components) return;

      const neighborPosition = components.get(Position);
      const neighborVelocity = components.get(Velocity);
      const neighborGroup = components.get(Group);

      if (!neighborPosition || !neighborVelocity || !neighborGroup) return;

      alignment.add(this.toVector(p5, neighborVelocity));
      cohesion.add(this.toVector(p5, neighborPosition));

      const diff = this.toVector(p5, position).sub(
        this.toVector(p5, neighborPosition),
      );
      diff.div(position.distanceTo(neighborPosition));
      separation.add(diff);

      // Apply repulsion force if the boids are from different groups
      if (group.getId() !== neighborGroup.getId()) {
        const repulsionForce = this.toVector(p5, position)
          .sub(this.toVector(p5, neighborPosition))
          .normalize()
          .mult(REPULSION_FORCE);
        repulsion.add(repulsionForce);
      }
    });

    this.applyForces(
      alignment,
      cohesion,
      separation,
      repulsion,
      neighbors.length,
      p5,
      position,
      velocity,
      maxForce,
      maxSpeed,
    );
  }

  /**
   * Converts Position or Velocity to p5.Vector.
   *
   * @param p5 - Instance of p5.js for vector calculations.
   * @param component - The Position or Velocity component to convert.
   * @returns The p5.Vector representation of the component.
   */
  private toVector(
    p5: P5CanvasInstance,
    component: Position | Velocity,
  ): p5.Vector {
    return p5.createVector(component.getX(), component.getY());
  }

  /**
   * Applies the calculated forces to the velocity.
   *
   * @param alignment - The alignment force vector.
   * @param cohesion - The cohesion force vector.
   * @param separation - The separation force vector.
   * @param repulsion - The repulsion force vector.
   * @param neighborCount - The number of neighboring boids.
   * @param p5 - Instance of p5.js for vector calculations.
   * @param position - The position of the current boid.
   * @param velocity - The velocity of the current boid.
   * @param maxForce - The maximum steering force.
   * @param maxSpeed - The maximum speed.
   */
  private applyForces(
    alignment: p5.Vector,
    cohesion: p5.Vector,
    separation: p5.Vector,
    repulsion: p5.Vector,
    neighborCount: number,
    p5: P5CanvasInstance,
    position: Position,
    velocity: Velocity,
    maxForce: number,
    maxSpeed: number,
  ): void {
    if (neighborCount > 0) {
      alignment.div(neighborCount).limit(maxForce);
      cohesion
        .div(neighborCount)
        .sub(this.toVector(p5, position))
        .limit(maxForce);
      separation.div(neighborCount).limit(maxForce);
    }

    velocity.set(
      velocity.getX() + alignment.x + cohesion.x + separation.x + repulsion.x,
      velocity.getY() + alignment.y + cohesion.y + separation.y + repulsion.y,
    );

    const limitedVelocity = p5
      .createVector(velocity.getX(), velocity.getY())
      .limit(maxSpeed);
    velocity.set(limitedVelocity.x, limitedVelocity.y);
  }
}
