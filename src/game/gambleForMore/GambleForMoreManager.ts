import {
    GambleForMoreSettings
} from "./GambleForMoreSettings";

import {
    GambleForMoreGameId
} from "./GambleForMoreGameId";

import {
    GambleForMoreOffer
} from "./GambleForMoreTypes";


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
        currentWin: number
    ): GambleForMoreOffer {

        const gameId =
            this.selectGame();


        /*
            TYMCZASOWO x2.

            Docelową ekonomię:
            win/bet → potential multiplier
            zrobimy osobno.
        */
        const potentialWin =
            currentWin * 2;


        return {
            currentWin,
            potentialWin,
            gameId
        };
    }
}