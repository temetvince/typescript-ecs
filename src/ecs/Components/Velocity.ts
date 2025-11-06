import { Component } from '../EntityComponentSystem/Component';

/**
 * Represents the velocity of an object in a 2D space.
 */
export class Velocity extends Component {
  private x: number;
  private y: number;

  /**
   * Creates a new instance of the Velocity class.
   * @param x The velocity along the x-axis.
   * @param y The velocity along the y-axis.
   */
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  /**
   * Sets the velocity along the x-axis.
   * @param x The velocity along the x-axis.
   * @returns The current Velocity instance.
   */
  setX(x: number): this {
    this.x = x;
    this.isDirty = true;
    return this;
  }

  /**
   * Gets the velocity along the x-axis.
   * @returns The velocity along the x-axis.
   */
  getX(): number {
    return this.x;
  }

  /**
   * Sets the velocity along the y-axis.
   * @param y The velocity along the y-axis.
   * @returns The current Velocity instance.
   */
  setY(y: number): this {
    this.y = y;
    this.isDirty = true;
    return this;
  }

  /**
   * Gets the velocity along the y-axis.
   * @returns The velocity along the y-axis.
   */
  getY(): number {
    return this.y;
  }

  /**
   * Sets the velocity along the x and y axes.
   * @param x The velocity along the x-axis.
   * @param y The velocity along the y-axis.
   * @returns The current Velocity instance.
   */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    this.isDirty = true;
    return this;
  }

  /**
   * Checks if this velocity is equal to another velocity.
   * @param other The other velocity to compare with.
   * @returns True if the velocities are equal, false otherwise.
   */
  equals(other: Velocity): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
