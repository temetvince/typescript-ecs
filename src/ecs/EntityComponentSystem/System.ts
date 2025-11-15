import { EntityComponentSystem } from './EntityComponentSystem';
import { ComponentClass } from './ComponentContainer';
import { Component } from './Component';
import Entity from './Entity';

/**
 * A System cares about a set of Components. It will run on every Entity
 * that has that set of Components.
 *
 * A System must specify two things:
 *
 *  (1) The immutable set of Components it needs at compile time. (Its
 *      immutability isn't enforced by anything but my wrath.) We now use the
 *      type `ComponentClass<T>` to refer to a Component's constructor; i.e.,
 *      `Position` (class) rather than `new Position()` (instance).
 *
 *  (2) An update() method for what to do every frame (if anything).
 */
export abstract class System {
  /**
   * Set of Component constructor classes, ALL of which are required before the
   * system is run on an entity.
   *
   * This should be defined at compile time and should never change.
   */
  public abstract componentsRequired: Set<ComponentClass<Component>>;

  /**
   * Set of Component constructor classes. If *ANY* of them become dirty, the
   * System will be given that Entity during its update(). Components
   * here need *not* be tracked by `componentsRequired`. To make this
   * opt-in, we default this to the empty set.
   */
  public dirtyComponents: Set<ComponentClass<Component>> = new Set();

  /**
   * The ECS is given to all Systems. Systems contain most of the game
   * code, so they need to be able to create, mutate, and destroy
   * Entities and Components.
   */
  public ecs!: EntityComponentSystem;

  /**
   * update() is called on the System every frame.
   * @param entities - The set of entities to update.
   * @param context - The context to use for drawing.
   */
  public abstract update(entities: Set<Entity>, context?: unknown): void;
}
