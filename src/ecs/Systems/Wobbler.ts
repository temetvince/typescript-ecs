import { System } from '../EntityComponentSystem/System';
import { Wobble } from '../Components/Wobble';
import { Position } from '../Components/Position';
import { Boid } from '../Components/Boid';
import { Entity } from '../EntityComponentSystem/EntityComponentSystem';

/**
 * The Wobbler system updates the wobble offsets for entities,
 * adding a smooth wobble effect to their movement.
 */
export class Wobbler extends System {
  componentsRequired = new Set<typeof Wobble | typeof Position | typeof Boid>([
    Wobble,
    Position,
    Boid,
  ]);
  public dirtyComponents = new Set<typeof Position>([Position]);

  /**
   * Updates the wobble offsets for each entity.
   *
   * @param entities - The set of entities to be updated.
   */
  update(entities: Set<Entity>): void {
    const time = performance.now() / 1000; // Convert time to seconds

    for (const entity of entities) {
      const components = this.ecs.getComponents(entity);
      if (!components) continue;

      const wobble = components.get(Wobble);
      const position = components.get(Position);

      if (wobble && position) {
        this.updateEntityWobble(position, wobble, time);
      }
    }
  }

  /**
   * Updates the position of a single entity based on its wobble component.
   *
   * @param position - The Position component of the entity.
   * @param wobble - The Wobble component of the entity.
   * @param time - The current time in seconds.
   */
  private updateEntityWobble(
    position: Position,
    wobble: Wobble,
    time: number,
  ): void {
    const offsetX =
      Math.sin(time * wobble.getFrequencyX() + wobble.getPhaseX()) *
      wobble.getAmplitude();
    const offsetY =
      Math.cos(time * wobble.getFrequencyY() + wobble.getPhaseY()) *
      wobble.getAmplitude();

    position.set(position.getX() + offsetX, position.getY() + offsetY);
  }
}
