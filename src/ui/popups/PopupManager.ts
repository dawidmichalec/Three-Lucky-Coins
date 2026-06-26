import { Container } from 'pixi.js';
import { Popup } from './Popup';
import { Overlay } from './Overlay';

export class PopupManager extends Container {
  private overlay: Overlay;
  private popup?: Popup;

  constructor(width: number, height: number) {
    super();

    this.overlay = new Overlay(width, height);
    this.overlay.visible = false;

    this.addChild(this.overlay);
  }

  show(message: string, width = 400, height = 220) {

    this.overlay.visible = true;

    if (this.popup) {
      this.removeChild(this.popup);
    }

    this.popup = new Popup({
      message,
      width,
      height,
      onClose: () => this.hide(),
    });

    this.popup.position.set(
      (this.overlay.width - width) / 2,
      (this.overlay.height - height) / 2
    );

    this.addChild(this.popup);
  }

  hide() {
    this.overlay.visible = false;

    if (this.popup) {
      this.removeChild(this.popup);
      this.popup = undefined;
    }
  }
}