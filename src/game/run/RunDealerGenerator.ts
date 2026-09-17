import { DealerData } from "../dealers/DealerData";

import { DealerGroup } from "../dealers/DealerGroup";

import {
  BEN_DATA,
  getRegularDealersByGroup,
  getSupervisorByGroup,
} from "../dealers/DealerRegistry";

export class RunDealerGenerator {
  
  static generateRun(): DealerData[] {
    return [
      ...this.generateJuniorStage(),
      ...this.generateMidStage(),
      ...this.generateSeniorStage(),
      ...this.generateMachineFloorStage(),
    ];
  }

  private static generateJuniorStage(): DealerData[] {

    const regularDealers = getRegularDealersByGroup(DealerGroup.JUNIOR);

    const randomPool = regularDealers.filter(
      (dealer) => dealer.id !== BEN_DATA.id,
    );

    const randomDealer = this.pickRandomDealer(randomPool);

    const supervisor = getSupervisorByGroup(DealerGroup.JUNIOR);

    if (!supervisor) {
      throw new Error("Junior Supervisor not found.");
    }

    return [BEN_DATA, randomDealer, supervisor];
  }

  private static generateMidStage(): DealerData[] {
    const regularDealers =
      getRegularDealersByGroup(
        DealerGroup.MID,
      );

    const randomDealers =
      this.pickRandomDealers(
        regularDealers,
        2,
      );

    const supervisor =
      getSupervisorByGroup(
        DealerGroup.MID,
      );

    if (!supervisor) {
      throw new Error(
        "Mid Supervisor not found.",
      );
    }

    return [
      ...randomDealers,
      supervisor,
    ];
  }

  private static pickRandomDealer(dealers: readonly DealerData[]): DealerData {
    if (dealers.length === 0) {
      throw new Error("Cannot select a random dealer from an empty pool.");
    }

    const randomIndex = Math.floor(Math.random() * dealers.length);

    return dealers[randomIndex];
  }

  private static pickRandomDealers(
    dealers: readonly DealerData[],
    count: number,
  ): DealerData[] {
    if (dealers.length < count) {
      throw new Error(
        `Cannot select ${count} dealers from a pool of ${dealers.length}.`,
      );
    }

    const pool = [...dealers];
    const selected: DealerData[] = [];

    for (let i = 0; i < count; i++) {
      const randomIndex =
        Math.floor(Math.random() * pool.length);

      selected.push(
        pool.splice(randomIndex, 1)[0],
      );
    }

    return selected;
  }

  private static generateSeniorStage(): DealerData[] {
    const regularDealers =
      getRegularDealersByGroup(
        DealerGroup.SENIOR,
      );

    const randomDealers =
      this.pickRandomDealers(
        regularDealers,
        2,
      );

    const supervisor =
      getSupervisorByGroup(
        DealerGroup.SENIOR,
      );

    if (!supervisor) {
      throw new Error(
        "Senior Supervisor not found.",
      );
    }

    return [
      ...randomDealers,
      supervisor,
    ];
  }

  private static generateMachineFloorStage(): DealerData[] {
    const regularMachines =
      getRegularDealersByGroup(
        DealerGroup.MACHINE_FLOOR,
      );

    return this.pickRandomDealers(
      regularMachines,
      2,
    );
  }
}
