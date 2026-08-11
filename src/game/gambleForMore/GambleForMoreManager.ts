import { GambleForMoreSettings } from "./GambleForMoreSettings";
import { GambleForMoreGameId } from "./GambleForMoreGameId";
import { GambleForMoreOffer } from "./GambleForMoreTypes";
import { roundMoney } from "../util/MoneyUtils";
import { calculateRedBlackPotentialWin } from "./games/redBlackCard/RedBlackCardConfig";
import { GambleForMoreGameId } from "./GambleForMoreGameId";


const DEFAULT_SETTINGS:
    GambleForMoreSettings = {

        enabled: false,

        triggerChance: 0,

        availableGames: [
            GambleForMoreGameId
                .RED_BLACK_CARD
        ]
    };


export class GambleForMoreManager {

    private settings:
        GambleForMoreSettings = {
            ...DEFAULT_SETTINGS
        };


    configure(
        settings?:
            Partial<GambleForMoreSettings>
    ) {

        this.settings = {
            ...DEFAULT_SETTINGS,
            ...settings
        };
    }


    shouldTrigger():
        boolean {

        if (!this.settings.enabled) {
            return false;
        }

        return (
            Math.random() <
            this.settings.triggerChance
        );
    }


    selectGame():
        GambleForMoreGameId {

        const games =
            this.settings.availableGames ??
            [
                GambleForMoreGameId
                    .RED_BLACK_CARD
            ];


        const index =
            Math.floor(
                Math.random() *
                games.length
            );


        return games[index];
    }


    createOffer(
        currentWin: number,
        bet: number
    ): GambleForMoreOffer {

        const gameId = this.selectGame();

        const potentialWin = this.calculatePotentialWin(
            gameId,
            currentWin,
            bet
        );

        return {
            currentWin,
            potentialWin,
            gameId
        };
    }


    private calculatePotentialWin(
        gameId: GambleForMoreGameId,
        currentWin: number,
        bet: number
    ): number {

        switch (gameId) {

            case GambleForMoreGameId.RED_BLACK_CARD:
                return calculateRedBlackPotentialWin(
                    currentWin,
                    bet
                );

            default:
                throw new Error(
                    `Unsupported Gamble For More game: ${gameId}`
                );
        }
    }
}