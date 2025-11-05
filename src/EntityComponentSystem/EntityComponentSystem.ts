import { P5CanvasInstance } from '@p5-wrapper/react';
import { Component } from './Component';
import { ComponentContainer, ComponentClass } from './ComponentContainer';
import { System } from './System';
import { createUUID } from '../Utils';

/**
 * Entity type: a unique string ID (UUID).
 */
export type Entity = string;

/**
 * The EntityComponentSystem (ECS) is the main driver; it's the backbone of the engine that
 * coordinates Entities, Components, and Systems. You could have a single
 * one for your game, or make a different one for every level, or have
 * multiple for different purposes.
 */
export class EntityComponentSystem {
  // Main state
  private entities = new Map<Entity, ComponentContainer>();
  private systems = new Map<System, Set<Entity>>();

  // Bookkeeping for entities.
  private nextEntityID = createUUID();
  private entitiesToDestroy: Entity[] = [];

  // API: Entities

  /**
   * Adds a new entity to the entity component system.
   * @returns The newly created entity.
   */
  public addEntity(): Entity {
    const entity = this.nextEntityID;
    this.nextEntityID = createUUID();
    this.entities.set(entity, new ComponentContainer());
    return entity;
  }

  /**
   * Marks `entity` for removal. The actual removal happens at the end
   * of the next `update()`. This way we avoid subtle bugs where an
   * Entity is removed mid-`update()`, with some Systems seeing it and
   * others not.
   * @param entity - The entity to remove.
   */
  public removeEntity(entity: Entity): void {
    this.entitiesToDestroy.push(entity);
  }

  // API: Components

  /**
   * Adds a component to an entity.
   * @param entity - The entity to add the component to.
   * @param component - The component to add.
   */
  public addComponent(entity: Entity, component: Component): void {
    this.entities.get(entity)?.add(component);
    this.checkEntity(entity);
  }

  /**
   * Retrieves the components associated with the specified entity.
   * @param entity - The entity for which to retrieve the components.
   * @returns The component container associated with the entity, or undefined if the entity has no components.
   */
  public getComponents(entity: Entity): ComponentContainer | undefined {
    return this.entities.get(entity);
  }

  /**
   * Removes a component from an entity.
   * @param entity - The entity from which to remove the component.
   * @param componentClass - The class of the component to remove (e.g., Position).
   */
  public removeComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass<T>,
  ): void {
    this.entities.get(entity)?.delete(componentClass);
    this.checkEntity(entity);
  }

  // API: Systems

  /**
   * Adds a system to the Entity Component System.
   * @param system - The system to be added.
   */
  public addSystem(system: System): void {
    if (system.componentsRequired.size === 0) {
      console.warn('System not added: empty Components list.', system);
      return;
    }

    system.ecs = this;
    this.systems.set(system, new Set());

    for (const entity of this.entities.keys()) {
      this.checkEntitySystem(entity, system);
    }
  }

  /**
   * Removes a system from the entity component system.
   * @param system - The system to be removed.
   */
  public removeSystem(system: System): void {
    this.systems.delete(system);
  }

  /**
   * This is ordinarily called once per tick (e.g., every frame). It
   * updates all Systems, then destroys any Entities that were marked
   * for removal.
   * @param p5 - The p5 instance to use for drawing.
   */
  public update(p5: P5CanvasInstance): void {
    for (const [system, entities] of this.systems.entries()) {
      const entitiesToUse = new Set<Entity>();

      for (const entity of entities) {
        const components = this.getComponents(entity);
        if (components?.isDirty()) {
          entitiesToUse.add(entity);
          for (const componentClass of system.dirtyComponents) {
            if (components.has(componentClass)) {
              components.resetDirty(componentClass);
              // No need to break — reset all matching dirty flags
            }
          }
        }
      }

      system.update(entitiesToUse, p5);
    }

    while (this.entitiesToDestroy.length > 0) {
      this.destroyEntity(this.entitiesToDestroy.pop());
    }
  }

  /**
   * Destroys an entity and removes it from the system.
   * @param entity - The entity to destroy.
   */
  private destroyEntity(entity: Entity | undefined): void {
    if (entity) {
      this.entities.delete(entity);
      for (const entities of this.systems.values()) {
        entities.delete(entity);
      }
    }
  }

  /**
   * Checks if an entity meets the requirements for any systems and updates the system's entities accordingly.
   * @param entity - The entity to check.
   */
  private checkEntity(entity: Entity): void {
    for (const system of this.systems.keys()) {
      this.checkEntitySystem(entity, system);
    }
  }

  /**
   * Checks if an entity meets the requirements for a specific system and updates the system's entities accordingly.
   * @param entity - The entity to check.
   * @param system - The system to check against.
   */
  private checkEntitySystem(entity: Entity, system: System): void {
    const have = this.entities.get(entity);
    const need = system.componentsRequired;

    if (have?.hasAll(need)) {
      this.systems.get(system)?.add(entity);
    } else {
      this.systems.get(system)?.delete(entity);
    }
  }
}
