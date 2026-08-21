import { Container } from "pixi.js";

import { DealerData } from "../../game/dealers/DealerData";

import { NextOpponentOverlay } from "../overlays/NextOpponentOverlay";

import { LayoutManager } from "../../core/LayoutManager";

export class DealerPresentationController {
  private nextOpponentOverlay!: NextOpponentOverlay;

  constructor(
    private parent: Container,

    private onStart: () => void,
  ) {}

  createInitial(dealer: DealerData) {
    this.nextOpponentOverlay = this.createOverlay(dealer);

    this.parent.addChild(this.nextOpponentOverlay);

    this.nextOpponentOverlay.show();

    this.parent.sortChildren();
  }

  async initCurrent(): Promise<void> {
    await this.nextOpponentOverlay.init();
  }

  async showDealer(dealer: DealerData): Promise<void> {
    this.destroyCurrentOverlay();

    this.nextOpponentOverlay = this.createOverlay(dealer);

    this.parent.addChild(this.nextOpponentOverlay);

    this.parent.sortChildren();

    this.nextOpponentOverlay.show();

    await this.nextOpponentOverlay.init();
  }

  private createOverlay(dealer: DealerData): NextOpponentOverlay {
    const layout = LayoutManager.getInstance();

    const overlay = new NextOpponentOverlay(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
      dealer,
      this.onStart,
    );

    overlay.zIndex = 4000;

    return overlay;
  }

  private destroyCurrentOverlay() {
    if (!this.nextOpponentOverlay) {
      return;
    }

    this.parent.removeChild(this.nextOpponentOverlay);

    this.nextOpponentOverlay.destroy({
      children: true,
    });
  }

  destroy() {
    this.destroyCurrentOverlay();
  }
}
