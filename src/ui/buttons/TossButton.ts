import { Container, Sprite, Text, Texture, Assets, Graphics, Rectangle } from 'pixi.js';

export class TossButton extends Container {
  private bg!: Sprite;

  private buttonWidth: number;
  private buttonHeight: number;

  private phase: 'idle' | 'kickback' | 'spin' = 'idle';
  private startRotation = 0;
  private targetRotation = 0;

  private isAnimating!: boolean;
  private speed = 0.2;

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

    this.bg.anchor.set(0.513, 0.497);
    this.bg.position.set(this.buttonWidth / 2, this.buttonHeight / 2);

    const hit = new Graphics()
      .rect(0, 0, this.buttonWidth, this.buttonHeight)
      .fill(0x000000);

    hit.alpha = 0.001; // niewidoczny ale klikalny
    hit.eventMode = 'static';
    hit.cursor = 'pointer';

    hit.on('pointertap', () => {
      this.startAnimation();
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
    this.alpha = value ? 0.85 : 1;
  }

  startAnimation() {
    if (this.phase !== 'idle') return;

    this.startRotation = this.bg.rotation;

    this.targetRotation = this.startRotation - 0.3;

    this.phase = 'kickback';
  }

  update(delta: number) {

    if (this.phase === 'idle')
        return;

    if (this.phase === 'kickback') {

      this.bg.rotation += (-0.15 * this.speed) * delta;

      if (this.bg.rotation <= this.targetRotation) {

          this.phase = 'spin';

          this.targetRotation = this.startRotation + Math.PI * 4;
      }

      return;
    }

    if (this.phase === 'spin') {

      this.bg.rotation += (1 * this.speed) * delta;

      if (this.bg.rotation >= this.targetRotation) {

          this.bg.rotation = this.targetRotation;
          this.phase = 'idle';
          this.isAnimating = false;
      }
    }
  }
}