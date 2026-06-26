import { Container, Sprite, Text, Texture, Assets, Graphics, Rectangle } from 'pixi.js';

export class TossButton extends Container {
  private bg!: Sprite;

  private buttonWidth: number;
  private buttonHeight: number;

  constructor(
    public label: string,
  ) {
    super();

    this.buttonWidth = 140;
    this.buttonHeight = 140;

    this.eventMode = 'static';
    this.cursor = 'pointer';
  }

  async init() {
    const texture = await Assets.load(
        '/assets/main/icons/toss_button_graphic.png'
    );

    this.bg = new Sprite(texture);

    const scaleX = this.buttonWidth / this.bg.texture.width;
    const scaleY = this.buttonHeight / this.bg.texture.height;

    this.bg.scale.set(scaleX, scaleY);

    this.addChild(this.bg);

    const text = new Text({
        text: this.label,
        style: {
        font: 'Open Sans',
        fontSize: 36,
        fontWeight: 'bold',
        fill: 0xffffff,
        align: 'center',
        },
    });

    text.anchor.set(0.5);

    this.bg.anchor?.set?.(0.5);
    this.bg.position.set(this.buttonWidth / 2, this.buttonHeight / 2);

    const hit = new Graphics()
      .rect(0, 0, this.buttonWidth, this.buttonHeight)
      .fill(0x000000);

    hit.alpha = 0.001; // niewidoczny ale klikalny
    hit.eventMode = 'static';
    hit.cursor = 'pointer';

    hit.on('pointertap', () => {
      this.emit('toss');
    });

    text.position.set(
        this.buttonWidth / 2,
        this.buttonHeight / 2
    );

    this.addChild(text);
    this.addChild(hit);
  }

  setDisabled(value: boolean) {
    this.eventMode = value ? 'none' : 'static';
    this.alpha = value ? 0.5 : 1;
  }
}