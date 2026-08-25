import { GambleForMoreManager } from "./GambleForMoreManager";
import { GambleForMoreOffer } from "./GambleForMoreTypes";

export class GambleForMoreController {
  private pendingOffer?: GambleForMoreOffer;

  constructor(private manager: GambleForMoreManager) {}

  start(winAmount: number, bet: number): GambleForMoreOffer {
    const offer = this.manager.createOffer(winAmount, bet);

    this.pendingOffer = offer;

    return offer;
  }

  getPendingOffer(): GambleForMoreOffer | undefined {
    return this.pendingOffer;
  }

  clearPendingOffer(): void {
    this.pendingOffer = undefined;
  }
}