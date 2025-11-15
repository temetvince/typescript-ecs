export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('logo', '/assets/favicon.ico');
  }

  create() {
    this.scene.start('Main');
  }
}
