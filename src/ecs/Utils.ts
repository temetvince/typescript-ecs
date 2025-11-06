import { Position } from './Components/Position';
import { getECS } from './ECS';
import { Entity } from './EntityComponentSystem/EntityComponentSystem';

/**
 * Finds and returns neighboring boids within the specified perception radius.
 *
 * @param entity - The current boid entity.
 * @param entities - Set of all entities.
 * @param position - The position of the current boid.
 * @param perceptionRadius - The radius within which to search for neighbors.
 * @returns An array of neighboring boid entities.
 */
export function getNeighbors(
  entity: Entity,
  entities: Set<Entity>,
  position: Position,
  perceptionRadius: number,
): Entity[] {
  return Array.from(entities).filter((other) => {
    if (other === entity) return false;
    const otherPosition = getECS().getComponents(other)?.get(Position);
    return (
      otherPosition && position.distanceTo(otherPosition) < perceptionRadius
    );
  });
}

/**
 * Generates a UUID (Universally Unique Identifier) using a combination of timestamp and random numbers.
 *
 * @returns A string representing the generated UUID.
 */
export function createUUID(): string {
  let d = new Date().getTime();
  let d2 =
    (typeof performance !== 'undefined' && performance.now() * 1000) || 0;

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16;
    const value = d > 0 ? (d + r) % 16 | 0 : (d2 + r) % 16 | 0;
    d = Math.floor(d / 16);
    d2 = Math.floor(d2 / 16);
    return (c === 'x' ? value : (value & 0x3) | 0x8).toString(16);
  });
}
