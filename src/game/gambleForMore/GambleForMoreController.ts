import { GambleForMoreManager } from "./GambleForMoreManager";
import { GambleForMoreOffer } from "./GambleForMoreTypes";
import { RedBlackCardGame } from "./games/redBlackCard/RedBlackCardGame";
import { CardColor, RedBlackCardResult, } from "./games/redBlackCard/RedBlackCardTypes";
import { GambleForMoreGameId } from "./GambleForMoreGameId";

export interface GambleForMoreDeclineResult {
  winAmount: number;
}

export interface GambleForMoreLossResult {
  lostAmount: number;
}

export class GambleForMoreController {
  private pendingOffer?: GambleForMoreOffer;
  private redBlackCardGame = new RedBlackCardGame();

  constructor(private manager: GambleForMoreManager) {}

    start(winAmount: number, bet: number): GambleForMoreOffer {
        const offer = this.manager.createOffer(winAmount, bet);

        this.pendingOffer = offer;

        return offer;
    }

    clearPendingOffer(): void {
        this.pendingOffer = undefined;
    }

    continueAfterWin(): GambleForMoreOffer {
        const currentOffer = this.pendingOffer;

        if (!currentOffer) {
            throw new Error(
            "Cannot continue Gamble For More without an active offer.",
            );
        }

        return this.start(
            currentOffer.potentialWin,
            currentOffer.bet,
        );
    }

    decline(): GambleForMoreDeclineResult {
        const offer =
            this.pendingOffer;

        if (!offer) {
            throw new Error(
            "Cannot decline Gamble For More without an active offer.",
            );
        }

        const result = {
            winAmount:
            offer.currentWin,
        };

        this.pendingOffer =
            undefined;

        return result;
    }

    hasPendingOffer(): boolean {
        return this.pendingOffer !== undefined;
    }

    play(selectedColor: CardColor): RedBlackCardResult {
        if (!this.pendingOffer) {
            throw new Error(
            "Cannot play Gamble For More without an active offer.",
            );
        }

        switch (this.pendingOffer.gameId) {
            case GambleForMoreGameId.RED_BLACK_CARD:
            return this.redBlackCardGame.play(selectedColor);

            default:
            throw new Error(
                `Unsupported Gamble For More game: ${this.pendingOffer.gameId}`,
            );
        }
    }

    lose(): GambleForMoreLossResult {
        const offer = this.pendingOffer;

        if (!offer) {
            throw new Error(
            "Cannot lose Gamble For More without an active offer.",
            );
        }

        const result = {
            lostAmount: offer.potentialWin,
        };

        this.pendingOffer = undefined;

        return result;
    }
}