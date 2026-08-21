import { CoinSide } from "../../ui/Coin";
import { COMBINATION_CONFIGS, CoinCombination } from "./CoinCombinations";
import { CombinationId } from "./CombinationId";

export function getCombinationId(
  combination: readonly CoinSide[],
): CombinationId {
  const entry = Object.values(COMBINATION_CONFIGS).find((config) =>
    config.sides.every((side, index) => side === combination[index]),
  );

  if (!entry) {
    throw new Error(`Unknown combination: ${combination.join("-")}`);
  }

  return entry.id;
}

export function getCombinationConfig(combination: readonly CoinSide[]) {
  const id = getCombinationId(combination);

  return COMBINATION_CONFIGS[id];
}

export function getCombinationById(id: CombinationId): CoinCombination {
  return COMBINATION_CONFIGS[id].sides;
}
