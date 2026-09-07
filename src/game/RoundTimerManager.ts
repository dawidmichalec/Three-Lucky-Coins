export class RoundTimerManager {
  private timeoutId?: number;
  private intervalId?: number;

  private remainingSeconds = 0;
  private active = false;

  start(
    durationSeconds: number,
    onTick: (seconds: number) => void,
    onExpired: () => void,
  ): void {
    this.cancel();

    this.remainingSeconds = durationSeconds;
    this.active = true;

    onTick(this.remainingSeconds);

    this.intervalId = window.setInterval(() => {
      this.remainingSeconds--;

      onTick(this.remainingSeconds);

      if (this.remainingSeconds <= 0) {
        this.cancel();
        onExpired();
      }
    }, 1000);
  }

  cancel(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }
}