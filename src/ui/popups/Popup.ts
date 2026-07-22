import { Container, Graphics, Text } from 'pixi.js';

type PopupProps = {
  message: string;
  width: number;
  height: number;
  onClose: () => void;
};

export class Popup extends Container {
  constructor({ message, width, height, onClose }: PopupProps) {
    super();

    // BACKGROUND
    const bg = new Graphics()
      .roundRect(0, 0, width, height, 50)
      .fill(0x4ca626);

    this.addChild(bg);

    // TEXT
    const text = new Text({
      text: message,
      style: {
        font: 'Open Sans',
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xffffff,
        align: 'center',
      }
    });

    text.anchor.set(0.5);
    text.position.set(width / 2, height / 2 - 30);

    this.addChild(text);

    // BUTTON OK
    const button = new Graphics()
      .roundRect(0, 0, 120, 40, 10)
      .fill(0x4ca626);

    button.position.set(width / 2 - 60, height - 70);

    button.eventMode = 'static';
    button.cursor = 'pointer';

    const buttonText = new Text({
      text: 'OK',
      style: {
        font: 'Open Sans',
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: 'bold',
      }
    });

    buttonText.anchor.set(0.5);
    buttonText.position.set(60, 20);

    button.addChild(buttonText);

    button.on('pointertap', () => {
      onClose();
    });

    this.addChild(button);
  }
}