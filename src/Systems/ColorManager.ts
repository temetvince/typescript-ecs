import { Color } from '../Components/Color';
import { Boid } from '../Components/Boid';
import { Group } from '../Components/Group';
import { Position } from '../Components/Position';
import { System } from '../EntityComponentSystem/System';
import { Entity } from '../EntityComponentSystem/EntityComponentSystem';

const TRANSITION_DURATION = 10000; // Duration of the color transition in milliseconds

/**
 * The ColorManager system manages the assignment and gradual transition of colors for all entities.
 */
export class ColorManager extends System {
  componentsRequired = new Set<typeof Position | typeof Boid | typeof Group>([
    Position,
    Boid,
    Group,
  ]);
  public dirtyComponents = new Set<typeof Color>();

  private transitionStartTime: number;
  private startColor: string;
  private targetColor: string;

  constructor() {
    super();
    this.transitionStartTime = Date.now();
    this.startColor = this.getRandomColor(); // Initialize with a random start color
    this.targetColor = this.getRandomColor(); // Initialize with a random target color
  }

  /**
   * Updates the ColorManager system, ensuring all entities transition to the target color.
   * @param {Set<Entity>} entities - The set of entities to be updated.
   */
  update(entities: Set<Entity>): void {
    const now = Date.now();

    const transitionProgress = Math.min(
      (now - this.transitionStartTime) / TRANSITION_DURATION,
      1,
    );
    const interpolatedColor = this.interpolateColor(
      this.startColor,
      this.targetColor,
      transitionProgress,
    );

    entities.forEach((entity) => {
      const components = this.ecs.getComponents(entity);
      if (!components) return;

      const color = components.get(Color);

      if (!color) {
        this.addColorComponent(entity, interpolatedColor);
      } else {
        color.setColor(interpolatedColor);
      }
    });

    // If transition is complete, set up the next transition
    if (transitionProgress >= 1) {
      this.startColor = this.targetColor;
      this.targetColor = this.getRandomColor();
      this.transitionStartTime = now;
    }
  }

  /**
   * Adds a color component to the entity.
   * @param {Entity} entity - The entity to add the color component to.
   * @param {string} color - The color to set.
   */
  private addColorComponent(entity: Entity, color: string): void {
    const colorComponent = new Color(color);
    this.ecs.addComponent(entity, colorComponent);
  }

  /**
   * Interpolates between two hex colors.
   * @param {string} startColor - The starting color.
   * @param {string} endColor - The ending color.
   * @param {number} fraction - The fraction of interpolation (0 to 1).
   * @returns {string} - The interpolated color.
   */
  private interpolateColor(
    startColor: string,
    endColor: string,
    fraction: number,
  ): string {
    const start = this.hexToRgb(startColor);
    const end = this.hexToRgb(endColor);
    const r = Math.round(start.r + (end.r - start.r) * fraction);
    const g = Math.round(start.g + (end.g - start.g) * fraction);
    const b = Math.round(start.b + (end.b - start.b) * fraction);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Converts a hex color to an RGB object.
   * @param {string} hex - The hex color.
   * @returns {object} - The RGB representation.
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  /**
   * Converts RGB values to a hex color.
   * @param {number} r - The red component.
   * @param {number} g - The green component.
   * @param {number} b - The blue component.
   * @returns {string} - The hex color.
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }

  /**
   * Generates a random hex color.
   * @returns {string} - The random hex color.
   */
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
