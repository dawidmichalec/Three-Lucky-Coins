import { DealerData } from "../dealers/DealerData";

import { DealerGroup } from "../dealers/DealerGroup";

import {
  BEN_DATA,
  getDealersByGroup,
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
      ...this.generateManagerStage(),
      ...this.generateVicePresidentStage(),
      ...this.generateOwnerStage(),
      ...this.generateTheHouseStage(),
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
    const regularMachines = getRegularDealersByGroup(DealerGroup.MACHINE_FLOOR);

    const randomMachines = this.pickRandomDealers(
      regularMachines,
      3,
    );

    const supervisor = getSupervisorByGroup(DealerGroup.MACHINE_FLOOR);

    if (!supervisor) {
      throw new Error("Machine Floor Supervisor not found.");
    }

    return [
      ...randomMachines,
      supervisor,
    ];
  }

  private static generateManagerStage(): DealerData[] {
    const managers = getRegularDealersByGroup(DealerGroup.MANAGER);

    return this.pickRandomDealers(managers, 2);
  }

  private static generateVicePresidentStage(): DealerData[] {
    const vicePresident = getSupervisorByGroup(DealerGroup.VICE_PRESIDENT);

    if (!vicePresident) {
      throw new Error("Vice President not found.");
    }

    return [vicePresident];
  }

  private static generateOwnerStage(): DealerData[] {
    const owners = getRegularDealersByGroup(DealerGroup.OWNER);

    const randomOwner = this.pickRandomDealer(owners);

    return [randomOwner];
  }
  
  private static generateTheHouseStage(): DealerData[] {
    const theHouse = getDealersByGroup(DealerGroup.THE_HOUSE)[0];

    if (!theHouse) {
      throw new Error("The House not found.");
    }

    return [theHouse];
  }
}
