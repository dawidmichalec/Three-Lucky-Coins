import { Container } from "pixi.js";

import { StatsManager } from "../../core/StatsManager";
import { RunSummaryPanel } from "../../ui/panels/RunSummaryPanel";
import { GameOverOverlay } from "../../ui/overlays/GameOverOverlay";
import { GameMessageOverlay } from "../../ui/overlays/GameMessageOverlay";

interface RunEndControllerOptions {
  onLockControls: () => void;

  onUnlockControls: () => void;
}

export class RunEndController {
  constructor(
    private statsManager: StatsManager,

    private runSummaryPanel: RunSummaryPanel,

    private gameOverOverlay: GameOverOverlay,

    private gameMessageOverlay: GameMessageOverlay,

    private options: RunEndControllerOptions,
  ) {}

  async triggerGameOver() {
    this.statsManager.getRunStats().won = false;

    this.options.onLockControls();

    await this.delay(350);

    await this.gameOverOverlay.play(1300);

    await this.showRunSummary();
  }

  async showRunVictory() {
    this.statsManager.getRunStats().won = true;

    await this.showRunSummary();
  }

  async showDealerVictory() {
    this.options.onLockControls();

    await this.gameMessageOverlay.play("youWon");

    this.options.onUnlockControls();
  }

  private async showRunSummary() {
    this.runSummaryPanel.refresh();

    this.runSummaryPanel.visible = true;

    this.runSummaryPanel.alpha = 0;

    await this.fadeInContainer(this.runSummaryPanel, 500);
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  private fadeInContainer(
    container: Container,
    duration: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        container.alpha = easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);

          return;
        }

        container.alpha = 1;

        resolve();
      };

      requestAnimationFrame(animate);
    });
  }
}
