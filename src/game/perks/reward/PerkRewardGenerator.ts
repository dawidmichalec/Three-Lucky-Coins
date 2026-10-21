
import { PERKS } from "../PerkRegistry";
import { PerkRarity } from "../PerkRarity";
import { PERK_RARITY_WEIGHTS } from "../PerkRarityConfig";
import { PerkReward } from "./PerkReward";
import { RunPerkRewardState } from "./RunPerkRewardState";
import { RunPerkManager } from "../RunPerkManager";
import { isStackingEnabledFor } from "../StackingRollout";

interface ForcedPerkReward {
  perkId: string;
  rarity?: PerkRarity;
}

export class PerkRewardGenerator {
  private forcedPerkReward?: ForcedPerkReward;

  generate(
    state: RunPerkRewardState,
    runPerkManager: RunPerkManager,
    count = 3,
  ): readonly PerkReward[] {
    const availableRewards = this.getAvailableRewards(
      state,
      runPerkManager,
    );

    const availableFamilies = new Set(
      availableRewards.map((reward) => reward.perk.id),
    );

    if (availableFamilies.size < count) {
      throw new Error(
        `Not enough distinct perk families. Requested: ${count}, available: ${availableFamilies.size}.`,
      );
    }

    const selectedRewards: PerkReward[] = [];
    const selectedFamilies = new Set<string>();

    // FORCED PERK REWARD (QA / CHEATS)

    if (this.forcedPerkReward) {
      const { perkId, rarity } = this.forcedPerkReward;

      const forcedReward = availableRewards.find(
        (reward) =>
          reward.perk.id === perkId &&
          (
            rarity === undefined ||
            reward.variant.rarity === rarity
          ),
      );

      if (!forcedReward) {
        console.warn(
          `Forced perk reward "${perkId}"${rarity ? ` (${rarity})` : ""} is not available.`,
        );
      } else {
        selectedRewards.push(forcedReward);
        selectedFamilies.add(forcedReward.perk.id);
      }

      this.forcedPerkReward = undefined;
    }

    // WEIGHTED RANDOM REWARDS

    while (selectedRewards.length < count) {
      const eligibleRewards = availableRewards.filter(
        (reward) => !selectedFamilies.has(reward.perk.id),
      );

      const reward = this.pickWeightedReward(eligibleRewards);

      selectedRewards.push(reward);
      selectedFamilies.add(reward.perk.id);
    }

    // RECORD SHOWN VARIANTS

    for (const reward of selectedRewards) {
      state.markAsShown(
        reward.perk.id,
        reward.variant.rarity,
      );
    }

    return selectedRewards;
  }

  private pickWeightedReward(
    rewards: readonly PerkReward[],
  ): PerkReward {
    const availableRarities = Object.values(PerkRarity).filter(
      (rarity) =>
        PERK_RARITY_WEIGHTS[rarity] > 0 &&
        rewards.some(
          (reward) => reward.variant.rarity === rarity,
        ),
    );

    if (availableRarities.length === 0) {
      throw new Error(
        "No perk rewards with positive rarity weights available.",
      );
    }

    const totalWeight = availableRarities.reduce(
      (sum, rarity) => sum + PERK_RARITY_WEIGHTS[rarity],
      0,
    );

    let roll = Math.random() * totalWeight;

    let selectedRarity =
      availableRarities[availableRarities.length - 1];

    for (const rarity of availableRarities) {
      roll -= PERK_RARITY_WEIGHTS[rarity];

      if (roll < 0) {
        selectedRarity = rarity;
        break;
      }
    }

    const rarityPool = rewards.filter(
      (reward) => reward.variant.rarity === selectedRarity,
    );

    return rarityPool[
      Math.floor(Math.random() * rarityPool.length)
    ];
  }

  
  private getAvailableRewards(
    state: RunPerkRewardState,
    runPerkManager: RunPerkManager,
  ): PerkReward[] {
    const rewards: PerkReward[] = [];

    for (const perk of PERKS) {
      const familyAlreadyAcquired =
        state.hasBeenAcquired(perk.id);

      if (
        familyAlreadyAcquired &&
        !isStackingEnabledFor(perk)
      ) {
        continue;
      }

      const activeRarities = new Set(
        runPerkManager
          .getPerkInstances(perk.id)
          .map((instance) => instance.variant.rarity),
      );

      for (const variant of perk.variants) {
        // Once offered, a variant never returns.
        if (
          state.hasBeenShown(
            perk.id,
            variant.rarity,
          )
        ) {
          continue;
        }

        // Do not offer a rarity already active,
        // including one obtained through an upgrade.
        if (activeRarities.has(variant.rarity)) {
          continue;
        }

        rewards.push({
          perk,
          variant,
        });
      }
    }

    return rewards;
  }

  forceNextPerk(
    perkId: string,
    rarity?: PerkRarity,
  ): void {
    this.forcedPerkReward = {
      perkId,
      rarity,
    };
  }
}
