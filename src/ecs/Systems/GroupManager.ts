import { Boid } from '../Components/Boid';
import { Group } from '../Components/Group';
import { Position } from '../Components/Position';
import { Entity } from '../EntityComponentSystem/EntityComponentSystem';
import { System } from '../EntityComponentSystem/System';
import { createUUID, getNeighbors } from '../Utils';

const PERCEPTION_RADIUS = 150;

/**
 * The GroupManager system manages the assignment of group identifiers to boids and their neighbors.
 */
export class GroupManager extends System {
  componentsRequired = new Set<typeof Position | typeof Boid>([Position, Boid]);
  public dirtyComponents = new Set<typeof Group>();

  /**
   * Updates the GroupManager system by assigning group IDs to boids and their neighbors.
   *
   * @param entities - The set of entities to be updated.
   */
  update(entities: Set<Entity>): void {
    entities.forEach((entity) => {
      const components = this.ecs.getComponents(entity);
      if (!components) return;

      let group = components.get(Group);
      if (!group) {
        group = this.assignGroupToEntity(entity);
      }

      const groupId = group.getId();
      const neighbors = getNeighbors(
        entity,
        entities,
        components.get(Position) ??
          (() => {
            throw new Error('Position component is missing');
          })(),
        PERCEPTION_RADIUS,
      );

      neighbors.forEach((neighbor) => {
        this.assignGroupToNeighbor(neighbor, groupId);
      });
    });
  }

  /**
   * Assigns a new group to the given entity if it doesn't already have one.
   *
   * @param entity - The entity to assign the group to.
   * @returns The newly assigned Group component.
   */
  private assignGroupToEntity(entity: Entity): Group {
    const group = new Group(createUUID());
    this.ecs.addComponent(entity, group);
    return group;
  }

  /**
   * Assigns the given group ID to the neighbor if it doesn't already have one or has a different group ID.
   *
   * @param neighbor - The neighboring entity to assign the group to.
   * @param groupId - The group ID to assign to the neighbor.
   */
  private assignGroupToNeighbor(neighbor: Entity, groupId: string): void {
    const neighborComponents = this.ecs.getComponents(neighbor);
    if (!neighborComponents) return;

    let neighborGroup = neighborComponents.get(Group);
    if (!neighborGroup) {
      neighborGroup = new Group(groupId);
      this.ecs.addComponent(neighbor, neighborGroup);
    } else if (neighborGroup.getId() !== groupId) {
      neighborGroup.setId(groupId);
    }
  }
}
