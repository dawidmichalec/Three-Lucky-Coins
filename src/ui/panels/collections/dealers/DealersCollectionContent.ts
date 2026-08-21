import { Container } from "pixi.js";
import { DealerData } from "../../../../game/dealers/DealerData";
import { DealerGroup } from "../../../../game/dealers/DealerGroup";
import { getDealersByGroup } from "../../../../game/dealers/DealerRegistry";
import { DealerCollectionManager } from "../../../../game/dealers/collection/DealerCollectionManager";
import { TranslationKey } from "../../../../core/LocalizationManager";
import { DealerCollectionSection } from "./DealerCollectionSection";

interface DealerCollectionSectionConfig {
  group: DealerGroup;
  title: TranslationKey;
}

interface DealerCollectionContentOptions {
  width: number;
  onDealerClick: (dealer: DealerData) => void;
}

export class DealerCollectionContent extends Container {
  private collectionManager = DealerCollectionManager.getInstance();

  private readonly sectionSpacing = 55;

  private readonly sections: readonly DealerCollectionSectionConfig[] = [
    {
      group: DealerGroup.JUNIOR,
      title: "juniorDealers",
    },

    {
      group: DealerGroup.MID,
      title: "midDealers",
    },

    {
      group: DealerGroup.SENIOR,
      title: "seniorDealers",
    },

    {
      group: DealerGroup.MACHINE_FLOOR,
      title: "machineFloor",
    },

    {
      group: DealerGroup.MANAGEMENT,
      title: "management",
    },
  ];

  constructor(private options: DealerCollectionContentOptions) {
    super();
  }

  async init(): Promise<void> {
    let currentY = 0;

    for (const config of this.sections) {
      const dealers = getDealersByGroup(config.group);

      /*
                Nie pokazujemy pustej sekcji.

                Gdy dodasz pierwszego Seniora do registry,
                Senior Dealers pojawi się automatycznie.
            */

      if (dealers.length === 0) {
        continue;
      }

      const section = new DealerCollectionSection({
        title: config.title,

        dealers,

        width: this.options.width,

        isDealerDiscovered: (dealerId) =>
          this.collectionManager.isDealerDiscovered(dealerId),

        onDealerClick: this.options.onDealerClick,
      });

      await section.init();

      section.position.set(0, currentY);

      this.addChild(section);

      currentY += section.getHeight() + this.sectionSpacing;
    }
  }
}
