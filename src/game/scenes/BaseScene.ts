import { Container } from "pixi.js";

export abstract class BaseScene extends Container {
  async init(): Promise<void> {}

  abstract cleanup(): void;

  update(delta: number): void {
    void delta;
  }
}
