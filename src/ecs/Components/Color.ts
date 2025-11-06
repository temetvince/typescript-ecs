import { Component } from '../EntityComponentSystem/Component';

/**
 * The Color component represents the color of an entity, typically a boid in this context.
 * It stores a color value as a string and provides methods to set and get the color.
 */
export class Color extends Component {
  private color: string;

  /**
   * Constructs a new Color component.
   *
   * @param color - The initial color value as a string.
   */
  constructor(color: string) {
    super();
    this.color = color;
  }

  /**
   * Sets the color of the entity.
   *
   * @param color - The new color value as a string.
   * @returns The current instance of the Color component.
   */
  setColor(color: string): this {
    this.color = color;
    this.isDirty = true;
    return this;
  }

  /**
   * Gets the current color of the entity.
   *
   * @returns The current color value as a string.
   */
  getColor(): string {
    return this.color;
  }
}
