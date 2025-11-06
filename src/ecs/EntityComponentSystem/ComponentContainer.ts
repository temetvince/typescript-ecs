import { Component } from './Component';

/**
 * A type representing the class of a Component.
 * This is used to refer to Component types in a type-safe manner.
 */
export type ComponentClass<T extends Component> = abstract new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => T;

/**
 * This custom container is so that calling code can provide the
 * Component *instance* when adding (e.g., add(new Position(...))), and
 * provide the Component *class* otherwise (e.g., get(Position),
 * has(Position), delete(Position)).
 *
 * We now use `ComponentClass<T>` consistently instead of `Function` for type safety.
 * This avoids the broad `Function` type and ensures only valid component constructors
 * are used as keys.
 *
 * You might notice a footgun here: code that gets this object can
 * directly modify the Components inside (with add(...) and delete(...)).
 * This would screw up our ECS bookkeeping of mapping Systems to
 * Entities! We'll fix this later by only returning callers a view onto
 * the Components that can't change them.
 */
export class ComponentContainer {
  private map = new Map<ComponentClass<Component>, Component>();

  /**
   * Adds a component to the container.
   * @param component - The component to add.
   */
  public add(component: Component): void {
    this.map.set(component.constructor as ComponentClass<Component>, component);
  }

  /**
   * Retrieves a component of the specified type from the container.
   * @param componentClass - The class of the component to retrieve.
   * @returns The component of the specified type, or undefined if not found.
   */
  public get<T extends Component>(
    componentClass: ComponentClass<T>,
  ): T | undefined {
    return this.map.get(componentClass) as T | undefined;
  }

  /**
   * Checks if any component in the container is marked as dirty.
   * @returns True if any component is dirty, false otherwise.
   */
  public isDirty(): boolean {
    for (const component of this.map.values()) {
      if (component.isDirty) {
        return true;
      }
    }
    return false;
  }

  /**
   * Resets the dirty state of the specified component class.
   * @param componentClass - The component class to reset the dirty state for.
   */
  public resetDirty<T extends Component>(
    componentClass: ComponentClass<T>,
  ): void {
    this.map.get(componentClass)?.resetDirty();
  }

  /**
   * Checks if the container has a component of the specified type.
   * @param componentClass - The class of the component to check.
   * @returns True if the container has the component, false otherwise.
   */
  public has<T extends Component>(componentClass: ComponentClass<T>): boolean {
    return this.map.has(componentClass);
  }

  /**
   * Checks if the container has all the specified components.
   * @param componentClasses - An iterable of component classes to check.
   * @returns True if the container has all the components, false otherwise.
   */
  public hasAll<T extends Component>(
    componentClasses: Iterable<ComponentClass<T>>,
  ): boolean {
    for (const cls of componentClasses) {
      if (!this.map.has(cls)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Deletes a component from the container.
   * @param componentClass - The class of the component to delete.
   */
  public delete<T extends Component>(componentClass: ComponentClass<T>): void {
    this.map.delete(componentClass);
  }
}
