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

  onNextDealer: () => void;

  onDealer: (dealerId: string) => void;
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

    // NEXT DEALER

    this.cheatManager.register(CheatCode.NEXT_DEALER, () => {
      this.options.onNextDealer();
    });

    // SPECIFIC DEALER

    this.cheatManager.registerDealerCheat(
      (dealerId) => {
        this.options.onDealer(dealerId);
      },
    );

    // ===================================================
    // CHEATS FOR PERKS
    // ===================================================

    // MULTIPLIER BOOSTER

    this.cheatManager.register(CheatCode.FORCE_MULTIPLIER_BOOSTER_COMMON, () => {
      this.forcePerkReward("multiplier_booster", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_MULTIPLIER_BOOSTER_UNCOMMON, () => {
      this.forcePerkReward("multiplier_booster", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_MULTIPLIER_BOOSTER_RARE, () => {
      this.forcePerkReward("multiplier_booster", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_MULTIPLIER_BOOSTER_EPIC, () => {
      this.forcePerkReward("multiplier_booster", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_MULTIPLIER_BOOSTER_LEGENDARY, () => {
      this.forcePerkReward("multiplier_booster", PerkRarity.LEGENDARY);
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

    this.cheatManager.register(CheatCode.FORCE_RISK_TAKER_COMMON, () => {
      this.forcePerkReward("risk_taker", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_RISK_TAKER_UNCOMMON, () => {
      this.forcePerkReward("risk_taker", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_RISK_TAKER_RARE, () => {
      this.forcePerkReward("risk_taker", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_RISK_TAKER_EPIC, () => {
      this.forcePerkReward("risk_taker", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_RISK_TAKER_LEGENDARY, () => {
      this.forcePerkReward("risk_taker", PerkRarity.LEGENDARY);
    });

    // INSURANCE

    this.cheatManager.register(CheatCode.FORCE_INSURANCE, () => {
      this.forcePerkReward("insurance");
    });

    // GAMBLER

    this.cheatManager.register(CheatCode.FORCE_GAMBLER_COMMON, () => {
      this.forcePerkReward("gambler", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_GAMBLER_UNCOMMON, () => {
      this.forcePerkReward("gambler", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_GAMBLER_RARE, () => {
      this.forcePerkReward("gambler", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_GAMBLER_EPIC, () => {
      this.forcePerkReward("gambler", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_GAMBLER_LEGENDARY, () => {
      this.forcePerkReward("gambler", PerkRarity.LEGENDARY);
    });


    //DOUBLE DOWN

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

    // PIGGY BANK

    this.cheatManager.register(CheatCode.FORCE_PIGGY_BANK, () => {
      this.forcePerkReward("piggy_bank");
    });

    // DECISIVENESS

    this.cheatManager.register(CheatCode.FORCE_DECISIVENESS, () => {
      this.forcePerkReward("decisiveness");
    });

    // SAFETY NET

    this.cheatManager.register(CheatCode.FORCE_SAFETY_NET, () => {
      this.forcePerkReward("safety_net");
    });

    // UNDERDOG

    this.cheatManager.register(CheatCode.FORCE_UNDERDOG_COMMON, () => {
      this.forcePerkReward("underdog", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_UNDERDOG_UNCOMMON, () => {
      this.forcePerkReward("underdog", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_UNDERDOG_RARE, () => {
      this.forcePerkReward("underdog", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_UNDERDOG_EPIC, () => {
      this.forcePerkReward("underdog", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_UNDERDOG_LEGENDARY, () => {
      this.forcePerkReward("underdog", PerkRarity.LEGENDARY);
    });

    // HOT STREAK

    this.cheatManager.register(CheatCode.FORCE_HOT_STREAK_COMMON, () => {
      this.forcePerkReward("hot_streak", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_HOT_STREAK_UNCOMMON, () => {
      this.forcePerkReward("hot_streak", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_HOT_STREAK_RARE, () => {
      this.forcePerkReward("hot_streak", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_HOT_STREAK_EPIC, () => {
      this.forcePerkReward("hot_streak", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_HOT_STREAK_LEGENDARY, () => {
      this.forcePerkReward("hot_streak", PerkRarity.LEGENDARY);
    });

    // ON A ROLL

    this.cheatManager.register(CheatCode.FORCE_ON_A_ROLL_COMMON, () => {
      this.forcePerkReward("on_a_roll", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_ON_A_ROLL_UNCOMMON, () => {
      this.forcePerkReward("on_a_roll", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_ON_A_ROLL_RARE, () => {
      this.forcePerkReward("on_a_roll", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_ON_A_ROLL_EPIC, () => {
      this.forcePerkReward("on_a_roll", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_ON_A_ROLL_LEGENDARY, () => {
      this.forcePerkReward("on_a_roll", PerkRarity.LEGENDARY);
    });

    // GREED

    this.cheatManager.register(CheatCode.FORCE_GREED_COMMON, () => {
      this.forcePerkReward("greed", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_GREED_UNCOMMON, () => {
      this.forcePerkReward("greed", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_GREED_RARE, () => {
      this.forcePerkReward("greed", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_GREED_EPIC, () => {
      this.forcePerkReward("greed", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_GREED_LEGENDARY, () => {
      this.forcePerkReward("greed", PerkRarity.LEGENDARY);
    });

    // DAMAGE CONTROL

    this.cheatManager.register(CheatCode.FORCE_DAMAGE_CONTROL_COMMON, () => {
      this.forcePerkReward("damage_control", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_DAMAGE_CONTROL_UNCOMMON, () => {
      this.forcePerkReward("damage_control", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_DAMAGE_CONTROL_RARE, () => {
      this.forcePerkReward("damage_control", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_DAMAGE_CONTROL_EPIC, () => {
      this.forcePerkReward("damage_control", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_DAMAGE_CONTROL_LEGENDARY, () => {
      this.forcePerkReward("damage_control", PerkRarity.LEGENDARY);
    });

    // LOTTERY LOVER

    this.cheatManager.register(CheatCode.FORCE_LOTTERY_LOVER_COMMON, () => {
      this.forcePerkReward("lottery_lover", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_LOTTERY_LOVER_UNCOMMON, () => {
      this.forcePerkReward("lottery_lover", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_LOTTERY_LOVER_RARE, () => {
      this.forcePerkReward("lottery_lover", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_LOTTERY_LOVER_EPIC, () => {
      this.forcePerkReward("lottery_lover", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_LOTTERY_LOVER_LEGENDARY, () => {
      this.forcePerkReward("lottery_lover", PerkRarity.LEGENDARY);
    });

    // RISKY GAINS

    this.cheatManager.register(CheatCode.FORCE_RISKY_GAINS_COMMON, () => {
      this.forcePerkReward("risky_gains", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_RISKY_GAINS_UNCOMMON, () => {
      this.forcePerkReward("risky_gains", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_RISKY_GAINS_RARE, () => {
      this.forcePerkReward("risky_gains", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_RISKY_GAINS_EPIC, () => {
      this.forcePerkReward("risky_gains", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_RISKY_GAINS_LEGENDARY, () => {
      this.forcePerkReward("risky_gains", PerkRarity.LEGENDARY);
    });

    // LUCKY PRIZE

    this.cheatManager.register(CheatCode.FORCE_LUCKY_PRIZE_COMMON, () => {
      this.forcePerkReward("lucky_prize", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_LUCKY_PRIZE_UNCOMMON, () => {
      this.forcePerkReward("lucky_prize", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_LUCKY_PRIZE_RARE, () => {
      this.forcePerkReward("lucky_prize", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_LUCKY_PRIZE_EPIC, () => {
      this.forcePerkReward("lucky_prize", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_LUCKY_PRIZE_LEGENDARY, () => {
      this.forcePerkReward("lucky_prize", PerkRarity.LEGENDARY);
    });

    // GOLDEN BOY

    this.cheatManager.register(CheatCode.FORCE_GOLDEN_BOY_COMMON, () => {
      this.forcePerkReward("golden_boy", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_GOLDEN_BOY_UNCOMMON, () => {
      this.forcePerkReward("golden_boy", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_GOLDEN_BOY_RARE, () => {
      this.forcePerkReward("golden_boy", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_GOLDEN_BOY_EPIC, () => {
      this.forcePerkReward("golden_boy", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_GOLDEN_BOY_LEGENDARY, () => {
      this.forcePerkReward("golden_boy", PerkRarity.LEGENDARY);
    });

    // BOUNCE BACK

    this.cheatManager.register(CheatCode.FORCE_BOUNCE_BACK_COMMON, () => {
      this.forcePerkReward("bounce_back", PerkRarity.COMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_BOUNCE_BACK_UNCOMMON, () => {
      this.forcePerkReward("bounce_back", PerkRarity.UNCOMMON);
    });

    this.cheatManager.register(CheatCode.FORCE_BOUNCE_BACK_RARE, () => {
      this.forcePerkReward("bounce_back", PerkRarity.RARE);
    });

    this.cheatManager.register(CheatCode.FORCE_BOUNCE_BACK_EPIC, () => {
      this.forcePerkReward("bounce_back", PerkRarity.EPIC);
    });

    this.cheatManager.register(CheatCode.FORCE_BOUNCE_BACK_LEGENDARY, () => {
      this.forcePerkReward("bounce_back", PerkRarity.LEGENDARY);
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
