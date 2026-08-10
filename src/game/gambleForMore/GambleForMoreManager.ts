import {
    GambleForMoreSettings
} from "./GambleForMoreSettings";

import {
    GambleForMoreGameId
} from "./GambleForMoreGameId";


export class GambleForMoreManager {

    shouldTrigger(
        settings:
            GambleForMoreSettings
    ): boolean {

        if (!settings.enabled) {
            return false;
        }

        return (
            Math.random() <
            settings.triggerChance
        );
    }


    selectGame(
        settings:
            GambleForMoreSettings
    ): GambleForMoreGameId {

        const games =
            settings.availableGames ??
            Object.values(
                GambleForMoreGameId
            );


        const index =
            Math.floor(
                Math.random() *
                games.length
            );


        return games[index];
    }
}