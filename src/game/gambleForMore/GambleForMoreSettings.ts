import { GambleForMoreGameId } from "./GambleForMoreGameId";

export interface GambleForMoreSettings {
  enabled: boolean;

  triggerChance: number;

  availableGames?: readonly GambleForMoreGameId[];
}
