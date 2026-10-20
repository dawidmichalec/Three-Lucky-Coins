import { PERKS } from "../PerkRegistry";
import { PerkRarity } from "../PerkRarity";
import { PerkReward } from "./PerkReward";
import { RunPerkRewardState } from "./RunPerkRewardState";

interface ForcedPerkReward {
  perkId: string;
  rarity?: PerkRarity;
}

export class PerkRewardGenerator {
  private forcedPerkReward?: ForcedPerkReward;

  
  generate(
    state: RunPerkRewardState,
    count = 3,
  ): readonly PerkReward[] {

    const availableRewards = this.getAvailableRewards(state);

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

    // RANDOM REWARDS - ONE VARIANT PER FAMILY

    const shuffledRewards = this.shuffle(availableRewards);

    for (const reward of shuffledRewards) {
      if (selectedRewards.length >= count) {
        break;
      }

      if (selectedFamilies.has(reward.perk.id)) {
        continue;
      }

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

  private getAvailableRewards(
    state: RunPerkRewardState,
  ): PerkReward[] {
    const rewards: PerkReward[] = [];

    for (const perk of PERKS) {
      if (state.hasBeenAcquired(perk.id)) {
        continue;
      }

      for (const variant of perk.variants) {
        if (
          state.hasBeenShown(
            perk.id,
            variant.rarity,
          )
        ) {
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

  private shuffle<T>(items: readonly T[]): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }

    return result;
  }

  forceNextPerk(perkId: string, rarity?: PerkRarity): void {
    this.forcedPerkReward = {
      perkId,
      rarity,
    };
  }
}