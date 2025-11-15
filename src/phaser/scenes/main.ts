import { EntityComponentSystem } from '../../ecs/EntityComponentSystem/EntityComponentSystem';
import { GameSetup } from '../../ecs/GameSetup';

export default class MainScene extends Phaser.Scene {
  private ecs!: EntityComponentSystem;

  constructor() {
    super('Main');
  }

  create() {
    this.ecs = GameSetup(0.8);
  }

  update(): void {
    this.ecs.update(this.game);
  }
}
