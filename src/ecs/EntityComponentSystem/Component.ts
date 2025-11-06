/**
 * A Component is a bundle of state. Each instance of a Component is
 * associated with a single Entity.
 *
 * Components have no API to fulfill.
 */
export abstract class Component {
  /**
   * Indicates whether the component has been modified and needs to be updated.
   */
  public isDirty: boolean = true;

  /**
   * Resets the dirty flag of the component.
   */
  public resetDirty(): void {
    this.isDirty = false;
  }
}
