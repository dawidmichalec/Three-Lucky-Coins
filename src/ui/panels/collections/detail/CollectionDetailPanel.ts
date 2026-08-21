import { Container } from "pixi.js";
import { Overlay } from "../../../popups/Overlay";
import { ClosePanelButton } from "../../../buttons/ClosePanelButton";
import { LayoutManager } from "../../../../core/LayoutManager";
import { DealerData } from "../../../../game/dealers/DealerData";
import { DealerDetailContent } from "./DealerDetailContent";

export class CollectionDetailPanel extends Container {
  private layoutManager = LayoutManager.getInstance();

  private contentContainer = new Container();

  constructor(private onClose: () => void) {
    super();

    this.visible = false;

    const overlay = new Overlay(
      this.layoutManager.DESIGN_WIDTH,
      this.layoutManager.DESIGN_HEIGHT,
    );

    this.addChild(overlay, this.contentContainer);

    void this.createCloseButton();
  }

  private async createCloseButton(): Promise<void> {
    const close = new ClosePanelButton();

    await close.init();

    close.position.set(1750, 108);

    close.on("pointerdown", () => {
      close.scale.set(0.95);
    });

    close.on("pointerup", () => {
      close.scale.set(1);
    });

    close.on("pointerupoutside", () => {
      close.scale.set(1);
    });

    close.on("pointertap", () => {
      this.hide();
      this.onClose();
    });

    this.addChild(close);
  }

  async showDealer(dealer: DealerData): Promise<void> {
    this.contentContainer.removeChildren();

    const content = new DealerDetailContent(dealer);

    await content.init();

    this.contentContainer.addChild(content);

    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
