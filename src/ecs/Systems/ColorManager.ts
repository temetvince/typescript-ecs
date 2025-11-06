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
  private startColor: { r: number; g: number; b: number; a: number };
  private targetColor: { r: number; g: number; b: number; a: number };
  private alpha?: number;

  /**
   * Creates a random color with the specified alpha value.
   * @param alpha - The alpha (transparency) value for the color (0 to 1).
   */
  constructor(alpha?: number) {
    super();
    this.alpha = alpha;
    this.transitionStartTime = Date.now();
    this.startColor = this.getRandomColor(); // Initialize with a random start RGBA color
    this.targetColor = this.getRandomColor(); // Initialize with a random target RGBA color
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

      const colorString = `rgba(${String(Math.round(interpolatedColor.r))}, ${String(Math.round(interpolatedColor.g))}, ${String(Math.round(interpolatedColor.b))}, ${String(interpolatedColor.a)})`;

      if (!color) {
        this.addColorComponent(entity, colorString);
      } else {
        color.setColor(colorString);
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
   * @param {string} color - The color string.
   */
  private addColorComponent(entity: Entity, color: string): void {
    const colorComponent = new Color(color);
    this.ecs.addComponent(entity, colorComponent);
  }

  /**
   * Interpolates between two RGBA colors.
   * @param {object} startColor - The starting RGBA color.
   * @param {object} endColor - The ending RGBA color.
   * @param {number} fraction - The fraction of interpolation (0 to 1).
   * @returns {object} - The interpolated RGBA color.
   */
  private interpolateColor(
    startColor: { r: number; g: number; b: number; a: number },
    endColor: { r: number; g: number; b: number; a: number },
    fraction: number,
  ): { r: number; g: number; b: number; a: number } {
    return {
      r: Math.round(startColor.r + (endColor.r - startColor.r) * fraction),
      g: Math.round(startColor.g + (endColor.g - startColor.g) * fraction),
      b: Math.round(startColor.b + (endColor.b - startColor.b) * fraction),
      a: startColor.a + (endColor.a - startColor.a) * fraction,
    };
  }

  /**
   * Generates a random RGBA color.
   * @returns {object} - The random RGBA color object with alpha between 0.5 and 1.0.
   */
  private getRandomColor(): { r: number; g: number; b: number; a: number } {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
      a: this.alpha !== undefined ? this.alpha : 1,
    };
  }
}
