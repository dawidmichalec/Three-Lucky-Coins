import { Container } from 'pixi.js';
import { Popup } from './Popup';
import { Overlay } from './Overlay';
import { ConfirmationPopup } from './ConfirmationPopup';

export class PopupManager extends Container {
  private overlay: Overlay;
  private popup?: Popup;
  private confirmationPopup?: ConfirmationPopup;

  constructor(width: number, height: number) {
    super();

    this.overlay = new Overlay(width, height);
    this.overlay.visible = false;

    this.addChild(this.overlay);
  }

  show(
      message: string,
      width = 400,
      height = 220,
      onClose?: () => void
  ) {

    this.overlay.visible = true;

    if (this.popup) {
        this.removeChild(this.popup);
    }

    this.popup = new Popup({
      message,
      width,
      height,

      onClose: () => {

        this.hide();

        if(onClose){
            onClose();
        }

      },
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
        this.popup.destroy();

        this.popup = undefined;

    }


    if (this.confirmationPopup) {

        this.removeChild(this.confirmationPopup);
        this.confirmationPopup.destroy();

        this.confirmationPopup = undefined;

    }

  }

  showConfirmation(
      message: string,
      onConfirm: () => void
  ) {

    this.overlay.visible = true;


    if(this.confirmationPopup){
        this.removeChild(this.confirmationPopup);
        this.confirmationPopup.destroy();
    }


    this.confirmationPopup = new ConfirmationPopup({

        message,

        onConfirm: () => {

            onConfirm();
            this.hide();

        },

        onCancel: () => {

            this.hide();

        }

    });


    this.confirmationPopup.position.set(
        (this.overlay.width - 600) / 2,
        (this.overlay.height - 300) / 2
    );


    this.addChild(this.confirmationPopup);
  }
}