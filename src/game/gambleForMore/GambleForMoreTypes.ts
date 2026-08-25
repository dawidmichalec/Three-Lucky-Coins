import { GambleForMoreGameId } from "./GambleForMoreGameId";

export interface GambleForMoreOffer {
  currentWin: number;

  potentialWin: number;

  bet: number;

  gameId: GambleForMoreGameId;
}
