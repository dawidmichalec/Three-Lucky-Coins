import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { DealerData } from "../../../../game/dealers/DealerData";

interface DealerCollectionSlotOptions {
  dealer: DealerData;
  discovered: boolean;
  size?: number;
  onClick: (dealer: DealerData) => void;
}

export class DealerCollectionSlot extends Container {
  private readonly size: number;

  constructor(private options: DealerCollectionSlotOptions) {
    super();

    this.size = options.size ?? 120;

    this.eventMode = "static";
    this.cursor = "pointer";
  }

  async init(): Promise<void> {
    const avatarPath = this.options.discovered
      ? this.options.dealer.avatarSmall
      : this.options.dealer.avatarLocked;

    const texture = await Assets.load(avatarPath);

    const avatar = new Sprite(texture);

    avatar.width = this.size;
    avatar.height = this.size;

    const border = new Graphics()
      .roundRect(0, 0, this.size, this.size, 10)
      .stroke({
        color: 0xb8860b,
        width: 2,
      });

    this.on("pointertap", () => {
      this.options.onClick(this.options.dealer);
    });

    this.addChild(avatar, border);
  }
}
