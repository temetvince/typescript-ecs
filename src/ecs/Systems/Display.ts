import Phaser from 'phaser';
import { Position } from '../Components/Position';
import { Color } from '../Components/Color';
import { System } from '../EntityComponentSystem/System';
import Entity from '../EntityComponentSystem/Entity';

/**
 * The Display system is responsible for rendering entities with a Position and Color component.
 * It uses Phaser to draw points representing the entities on the scene's canvas.
 *
 * Expects a Phaser.Scene passed into update() as the "context" parameter.
 */
export class Display extends System {
  componentsRequired = new Set<typeof Position | typeof Color>([
    Position,
    Color,
  ]);

  private graphics?: Phaser.GameObjects.Graphics;
  private lastScene?: Phaser.Scene;

  /**
   * Updates the Display system, rendering all entities with a Position and Color component.
   *
   * @param entities - The set of entities to be updated and rendered.
   * @param context - The Phaser.Scene instance used for rendering (passed from the Scene).
   */
  update(entities: Set<Entity>, context?: unknown): void {
    let scene: Phaser.Scene | undefined;

    // Accept either a Scene or a Game
    if (context instanceof Phaser.Scene) {
      scene = context;
    } else if (context instanceof Phaser.Game) {
      // Prefer an active scene if a Game is passed
      const activeScenes = context.scene.getScenes(true);
      if (activeScenes.length > 0) scene = activeScenes[0];
    } else {
      // fallback: reuse lastScene if available
      scene = this.lastScene;
    }

    if (!scene) return;
    // ensure the scene exposes add.graphics()
    if (typeof scene.add.graphics !== 'function') return;

    // If scene changed, recreate graphics and hook up cleanup.
    if (scene !== this.lastScene) {
      this.graphics?.destroy();
      this.graphics = scene.add.graphics();
      this.lastScene = scene;

      // Clean up graphics when the scene is shutdown/destroyed.
      const cleanup = () => {
        this.graphics?.destroy();
        this.graphics = undefined;
        this.lastScene = undefined;
        scene.events.off('shutdown', cleanup);
        scene.events.off('destroy', cleanup);
      };
      scene.events.once('shutdown', cleanup);
      scene.events.once('destroy', cleanup);
    }

    if (!this.graphics) {
      // Safety: try to create one if it doesn't exist
      if (typeof scene.add.graphics === 'function') {
        this.graphics = scene.add.graphics();
      } else {
        return;
      }
    }

    // Clear previous frame drawing
    this.graphics.clear();

    for (const entity of entities) {
      const components = this.ecs.getComponents(entity);
      if (!components) continue;

      const position = components.get(Position);
      const color = components.get(Color);

      if (position && color) {
        this.renderEntity(scene, this.graphics, position, color);
      }
    }
  }

  /**
   * Renders an individual entity on the canvas using Phaser Graphics.
   *
   * @param scene - Phaser.Scene the graphics object belongs to (unused but typed).
   * @param graphics - Graphics object used to draw.
   * @param position - The Position component of the entity.
   * @param color - The Color component of the entity.
   */
  private renderEntity(
    _scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    position: Position,
    color: Color,
  ): void {
    const colorVal = color.getColor();
    const hex = this.colorToHex(colorVal);

    // Replicates p5.strokeWeight(10)/point using a filled circle in Phaser.
    const radius = 5;
    graphics.fillStyle(hex, 1);
    graphics.fillCircle(position.getX(), position.getY(), radius);
  }

  /**
   * Convert common color formats to a Phaser hex number (0xRRGGBB)
   */
  private colorToHex(colorValue: unknown): number {
    if (typeof colorValue === 'number') {
      return colorValue;
    }

    if (typeof colorValue === 'string') {
      const s = colorValue.trim();
      // '#rrggbb'
      if (s.startsWith('#')) {
        return parseInt(s.slice(1), 16);
      }

      // try to parse css color names / rgb() using a canvas context (browser)
      try {
        const ctx = document.createElement('canvas').getContext('2d');
        if (ctx) {
          ctx.fillStyle = s; // set CSS color
          const computed = ctx.fillStyle; // should return '#rrggbb' or 'rgba(...)'
          if (typeof computed === 'string' && computed.startsWith('#')) {
            return parseInt(computed.slice(1), 16);
          }
          // fallback: handle 'rgb(r,g,b)'
          const rgb = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
          if (rgb) {
            const r = parseInt(rgb[1], 10);
            const g = parseInt(rgb[2], 10);
            const b = parseInt(rgb[3], 10);
            return (r << 16) + (g << 8) + b;
          }
        }
      } catch {
        // ignore and fallback
      }
    }

    // Default white if unknown format
    return 0xffffff;
  }
}
