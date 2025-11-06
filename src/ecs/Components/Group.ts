import { Component } from '../EntityComponentSystem/Component';

/**
 * The Group component represents the group identifier of an entity, typically a boid in this context.
 * It stores a numeric group ID and provides methods to set and get the ID.
 */
export class Group extends Component {
  private id: string;

  /**
   * Constructs a new Group component.
   *
   * @param id - The initial group ID.
   */
  constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Sets the group ID of the entity.
   *
   * @param id - The new group ID.
   * @returns The current instance of the Group component.
   */
  setId(id: string): this {
    this.id = id;
    this.isDirty = true;
    return this;
  }

  /**
   * Gets the current group ID of the entity.
   *
   * @returns The current group ID.
   */
  getId(): string {
    return this.id;
  }
}
