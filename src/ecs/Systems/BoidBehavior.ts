import Phaser from 'phaser';
import { System } from '../EntityComponentSystem/System';
import { Position } from '../Components/Position';
import { Velocity } from '../Components/Velocity';
import { Boid } from '../Components/Boid';
import { Group } from '../Components/Group';
import { getNeighbors } from '../Utils';
import Entity from '../EntityComponentSystem/Entity';

const PERCEPTION_RADIUS = 100;
const MAX_FORCE = 0.67;
const MAX_SPEED = 2;
const REPULSION_FORCE = 2; // Constant repulsion force between different groups

/**
 * The BoidBehavior system is responsible for applying boid behaviors (alignment, cohesion, separation),
 * and handling boundary collisions.
 *
 * This version uses Phaser.Math.Vector2 instead of p5.js vectors.
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
   * @param context - Optional Phaser.Scene/Game instance (unused here).
   */
  update(entities: Set<Entity>): void {
    for (const entity of entities) {
      const components = this.ecs.getComponents(entity);
      if (!components) continue;

      const position = components.get(Position);
      const velocity = components.get(Velocity);
      const group = components.get(Group);

      if (!position || !velocity || !group) {
        console.error(
          `Entity ${entity.toString()} is missing required components.`,
        );
        continue;
      }

      const neighbors = getNeighbors(
        this.ecs,
        entity,
        entities,
        position,
        PERCEPTION_RADIUS,
      );
      if (neighbors.length === 0) continue;

      this.applyBoidBehaviors(
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
   * @param position - The position of the current boid.
   * @param velocity - The velocity of the current boid.
   * @param neighbors - Array of neighboring boid entities.
   * @param group - The group of the current boid.
   * @param maxForce - The maximum steering force.
   * @param maxSpeed - The maximum speed.
   */
  private applyBoidBehaviors(
    position: Position,
    velocity: Velocity,
    neighbors: Entity[],
    group: Group,
    maxForce: number,
    maxSpeed: number,
  ): void {
    const alignment = new Phaser.Math.Vector2(0, 0);
    const cohesion = new Phaser.Math.Vector2(0, 0);
    const separation = new Phaser.Math.Vector2(0, 0);
    const repulsion = new Phaser.Math.Vector2(0, 0);

    for (const neighbor of neighbors) {
      const components = this.ecs.getComponents(neighbor);
      if (!components) continue;

      const neighborPosition = components.get(Position);
      const neighborVelocity = components.get(Velocity);
      const neighborGroup = components.get(Group);

      if (!neighborPosition || !neighborVelocity || !neighborGroup) continue;

      const neighborVelVec = this.toVectorFromVelocity(neighborVelocity);
      const neighborPosVec = this.toVectorFromPosition(neighborPosition);
      const posVec = this.toVectorFromPosition(position);

      alignment.add(neighborVelVec);
      cohesion.add(neighborPosVec);

      const distance = position.distanceTo(neighborPosition);
      if (distance > 0) {
        const diff = posVec.clone().subtract(neighborPosVec);
        diff.scale(1 / distance);
        separation.add(diff);
      }

      // Apply repulsion force if the boids are from different groups
      if (group.getId() !== neighborGroup.getId()) {
        const repulsionForce = posVec
          .clone()
          .subtract(neighborPosVec)
          .normalize()
          .scale(REPULSION_FORCE);
        repulsion.add(repulsionForce);
      }
    }

    this.applyForces(
      alignment,
      cohesion,
      separation,
      repulsion,
      neighbors.length,
      position,
      velocity,
      maxForce,
      maxSpeed,
    );
  }

  /**
   * Converts Position or Velocity to a Phaser.Math.Vector2.
   */
  private toVectorFromPosition(component: Position): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(component.getX(), component.getY());
  }

  private toVectorFromVelocity(component: Velocity): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(component.getX(), component.getY());
  }

  /**
   * Applies the calculated forces to the velocity.
   */
  private applyForces(
    alignment: Phaser.Math.Vector2,
    cohesion: Phaser.Math.Vector2,
    separation: Phaser.Math.Vector2,
    repulsion: Phaser.Math.Vector2,
    neighborCount: number,
    position: Position,
    velocity: Velocity,
    maxForce: number,
    maxSpeed: number,
  ): void {
    if (neighborCount > 0) {
      // average
      const invCount = 1 / neighborCount;
      alignment.scale(invCount);
      cohesion.scale(invCount);
      separation.scale(invCount);

      // cohesion: steer towards center
      const posVec = this.toVectorFromPosition(position);
      cohesion.subtract(posVec);

      // limit each steering vector
      this.limitVector(alignment, maxForce);
      this.limitVector(cohesion, maxForce);
      this.limitVector(separation, maxForce);
    }

    // add repulsion (no averaging — it's already scaled)
    // combine forces
    const totalForce = new Phaser.Math.Vector2(0, 0)
      .add(alignment)
      .add(cohesion)
      .add(separation)
      .add(repulsion);

    // Apply to velocity
    const newVx = velocity.getX() + totalForce.x;
    const newVy = velocity.getY() + totalForce.y;
    velocity.set(newVx, newVy);

    // limit overall speed
    const limitedVelocity = this.toVectorFromVelocity(velocity);
    this.limitVector(limitedVelocity, maxSpeed);
    velocity.set(limitedVelocity.x, limitedVelocity.y);
  }

  /**
   * Clamp vector length to max (in-place).
   */
  private limitVector(v: Phaser.Math.Vector2, max: number): void {
    const len = v.length();
    if (len > max && len > 0) {
      v.setLength(max);
    }
  }
}
