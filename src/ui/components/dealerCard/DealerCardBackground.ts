import { Container, Graphics } from "pixi.js";

export class DealerCardBackground extends Container {
  private bg!: Graphics;

  constructor(width: number, height: number) {
    super();

    this.bg = new Graphics()
      .roundRect(0, 0, width, height, 10)
      .fill({ color: 0x000000 })
      .stroke({ color: 0xffde59, width: 6 });

    this.addChild(this.bg);
  }
}
