export {}

class MyGameScene extends Phaser.Scene {
  translations: { [key: string]: string } = {};

  constructor() {
    super({ key: 'MyGameScene' });
  }

  preload() {
    this.load.json('en', '/locales/en.json');
    this.load.json('fr', '/locales/fr.json');
  }

  create() {
    const currentLang = 'en'; // Or dynamically detect the language
    this.translations = this.cache.json.get(currentLang);

    const welcomeText = this.translations['welcome'];
    this.add.text(100, 100, welcomeText, { font: '24px Arial', color: '#ffffff' });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MyGameScene,
};

const game = new Phaser.Game(config);
