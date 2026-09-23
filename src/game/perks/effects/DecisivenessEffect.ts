import { RunPerkManager } from "../RunPerkManager";

export class DecisivenessEffect {
  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  preventsCombinationBlocking(): boolean {
    return this.runPerkManager.hasPerk(
      "decisiveness",
    );
  }
}