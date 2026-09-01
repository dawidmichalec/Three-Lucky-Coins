import { CoinSide } from "../ui/Coin";
import { CheatManager } from "./CheatManager";
import { CheatActions } from "./CheatActions";
import { CheatCode } from "./CheatCodes";
import { GameController } from "../game/GameController";
import { GoldenCoinManager } from "../game/goldenCoins/GoldenCoinManager";
import { PerkRewardGenerator } from "../game/perks/reward/PerkRewardGenerator";
import { PerkRarity } from "../game/perks/PerkRarity";

interface GameCheatControllerOptions {
  onDealerWin: () => void;

  onGameOver: () => void;
}

export class GameCheatController {
  private forcedResult?: CoinSide[];

  constructor(
    private cheatManager: CheatManager,

    private gameController: GameController,

    private goldenCoinManager: GoldenCoinManager,

    private perkRewardGenerator: PerkRewardGenerator,

    private options: GameCheatControllerOptions,
  ) {
    this.registerCheats();
  }

  private registerCheats() {
    this.cheatManager.register(CheatCode.ALL_HEADS_WIN, () => {
      this.forceResult(CheatActions.allHeadsWin());
    });

    this.cheatManager.register(CheatCode.ALL_TAILS_WIN, () => {
      this.forceResult(CheatActions.allTailsWin());
    });

    this.cheatManager.register(CheatCode.NOT_ALL_SAME_WIN, () => {
      this.forceResult(CheatActions.notAllSameWin());
    });

    this.cheatManager.register(CheatCode.GOLDEN_ONE, () => {
      this.forceGoldenWin(1);
    });

    this.cheatManager.register(CheatCode.GOLDEN_TWO, () => {
      this.forceGoldenWin(2);
    });

    this.cheatManager.register(CheatCode.GOLDEN_THREE, () => {
      this.forceGoldenWin(3);
    });

    this.cheatManager.register(CheatCode.DEALER_WIN, () => {
      this.options.onDealerWin();
    });

    this.cheatManager.register(CheatCode.GAME_OVER, () => {
      this.options.onGameOver();
    });

    this.cheatManager.register(CheatCode.FORCE_MULTIPLIER_BOOSTER, () => {
      this.forcePerkReward("multiplier_booster");
    });

    // CASINO BONUS

    this.cheatManager.register(CheatCode.FORCE_CASINO_BONUS_COMMON, () => {
      this.forcePerkReward(
        "casino_bonus",
        PerkRarity.COMMON,
      );
    });

    this.cheatManager.register(CheatCode.FORCE_CASINO_BONUS_UNCOMMON, () => {
      this.forcePerkReward(
        "casino_bonus",
        PerkRarity.UNCOMMON,
      );
    });

    this.cheatManager.register(CheatCode.FORCE_CASINO_BONUS_RARE, () => {
      this.forcePerkReward(
        "casino_bonus",
        PerkRarity.RARE,
      );
    });

    this.cheatManager.register(CheatCode.FORCE_CASINO_BONUS_EPIC, () => {
      this.forcePerkReward(
        "casino_bonus",
        PerkRarity.EPIC,
      );
    });

    this.cheatManager.register(CheatCode.FORCE_CASINO_BONUS_LEGENDARY, () => {
      this.forcePerkReward(
        "casino_bonus",
        PerkRarity.LEGENDARY,
      );
    });

    // RISK TAKER

    this.cheatManager.register(CheatCode.FORCE_RISK_TAKER, () => {
      this.forcePerkReward("risk_taker");
    });

    this.cheatManager.register(CheatCode.FORCE_INSURANCE, () => {
      this.forcePerkReward("insurance");
    });

    this.cheatManager.register(CheatCode.FORCE_GAMBLER, () => {
      this.forcePerkReward("gambler");
    });

    this.cheatManager.register(CheatCode.FORCE_DOUBLE_DOWN, () => {
      this.forcePerkReward("double_down");
    });

    // COIN SENSE

    this.cheatManager.register(CheatCode.FORCE_COIN_SENSE_COMMON, () => {
      this.forcePerkReward("coin_sense", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_COIN_SENSE_UNCOMMON, () => {
      this.forcePerkReward("coin_sense", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_COIN_SENSE_RARE, () => {
      this.forcePerkReward("coin_sense", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_COIN_SENSE_EPIC, () => {
      this.forcePerkReward("coin_sense", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_COIN_SENSE_LEGENDARY, () => {
      this.forcePerkReward("coin_sense", PerkRarity.LEGENDARY);
    });

    // LUCKY HAND

    this.cheatManager.register(CheatCode.FORCE_LUCKY_HAND, () => {
      this.forcePerkReward("lucky_hand");
    });

    this.cheatManager.register(CheatCode.FORCE_PIGGY_BANK, () => {
      this.forcePerkReward("piggy_bank");
    });
  }

  consumeForcedResult(): CoinSide[] | undefined {
    if (!this.forcedResult) {
      return undefined;
    }

    const result = this.forcedResult;

    /*
            Cheat działa tylko
            dla jednego rzutu.
        */
    this.forcedResult = undefined;

    return result;
  }

  private forceResult(result: CoinSide[]) {
    this.forcedResult = result;

    console.log("FORCED RESULT:", result.join("-"));
  }

  private forceGoldenWin(goldenCount: number) {
    const selectedCombination = this.gameController.getCurrentCombo();

    this.forcedResult = [...selectedCombination];

    this.goldenCoinManager.forceNextGoldenCount(goldenCount);

    console.log(
      [
        `FORCED GOLDEN WIN: ${goldenCount}`,

        `FORCED COMBINATION: ${this.forcedResult.join("-")}`,
      ].join("\n"),
    );
  }

  private forcePerkReward(
    perkId: string,
    rarity?: PerkRarity,
  ): void {
    this.perkRewardGenerator.forceNextPerk(
      perkId,
      rarity,
    );

    console.log(
      "FORCED PERK REWARD:",
      perkId,
      rarity ?? "ANY",
    );
  }
}
