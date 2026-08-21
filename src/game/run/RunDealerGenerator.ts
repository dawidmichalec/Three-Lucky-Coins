import { DealerData } from "../dealers/DealerData";

import { DealerGroup } from "../dealers/DealerGroup";

import {
  BEN_DATA,
  getRegularDealersByGroup,
  getSupervisorByGroup,
} from "../dealers/DealerRegistry";

export class RunDealerGenerator {
  static generateRun(): DealerData[] {
    return [...this.generateJuniorStage()];
  }

  private static generateJuniorStage(): DealerData[] {
    /*
            Pobieramy wszystkich zwykłych
            Junior Dealerów.
        */

    const regularDealers = getRegularDealersByGroup(DealerGroup.JUNIOR);

    /*
            Ben jest gwarantowanym
            pierwszym przeciwnikiem.

            Dlatego nie może zostać
            ponownie wylosowany.
        */

    const randomPool = regularDealers.filter(
      (dealer) => dealer.id !== BEN_DATA.id,
    );

    const randomDealer = this.pickRandomDealer(randomPool);

    /*
            Junior stage kończy się
            walką z Supervisorem.
        */

    const supervisor = getSupervisorByGroup(DealerGroup.JUNIOR);

    if (!supervisor) {
      throw new Error("Junior Supervisor not found.");
    }

    return [BEN_DATA, randomDealer, supervisor];
  }

  private static pickRandomDealer(dealers: readonly DealerData[]): DealerData {
    if (dealers.length === 0) {
      throw new Error("Cannot select a random dealer from an empty pool.");
    }

    const randomIndex = Math.floor(Math.random() * dealers.length);

    return dealers[randomIndex];
  }
}
