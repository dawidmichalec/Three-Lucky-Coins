import { Container } from "pixi.js";
import { LocalizedText } from "../../../../localization/LocalizedText";
import { TranslationKey } from "../../../../core/LocalizationManager";
import { DealerData } from "../../../../game/dealers/DealerData";
import { DealerCollectionSlot } from "./DealerCollectionSlot";

interface DealerCollectionSectionOptions {
    title: TranslationKey;
    dealers: readonly DealerData[];
    width: number;
    isDealerDiscovered: (dealerId: string) => boolean;
    onDealerClick: (dealer: DealerData) => void;
}

export class DealerCollectionSection extends Container {

    private readonly slotSize = 120;
    private readonly horizontalSpacing = 24;
    private readonly verticalSpacing = 24;

    private readonly titleHeight = 40;
    private readonly titleToGridSpacing = 25;

    private contentHeight = 0;


    constructor(private options: DealerCollectionSectionOptions) {
        super();
    }


    async init(): Promise<void> {

        const title = new LocalizedText(
            this.options.title,
            {
                font: "Open Sans",
                fontSize: 32,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        );

        title.anchor.set(0.5, 0);

        title.position.set(
            this.options.width / 2,
            0
        );

        this.addChild(title);


        const columns = Math.max(
            1,
            Math.floor(
                (
                    this.options.width +
                    this.horizontalSpacing
                ) /
                (
                    this.slotSize +
                    this.horizontalSpacing
                )
            )
        );


        const gridStartY =
            this.titleHeight +
            this.titleToGridSpacing;


        const slotPromises = this.options.dealers.map(
            async (dealer, index) => {

                const column = index % columns;
                const row = Math.floor(index / columns);

                const slot = new DealerCollectionSlot({
                    dealer,
                    discovered:
                        this.options.isDealerDiscovered(
                            dealer.id
                        ),
                    size: this.slotSize,
                    onClick:
                        this.options.onDealerClick
                });

                await slot.init();

                slot.position.set(
                    column *
                        (
                            this.slotSize +
                            this.horizontalSpacing
                        ),
                    gridStartY +
                        row *
                        (
                            this.slotSize +
                            this.verticalSpacing
                        )
                );

                this.addChild(slot);
            }
        );


        await Promise.all(slotPromises);


        const rows = Math.ceil(
            this.options.dealers.length /
            columns
        );


        const gridHeight =
            rows > 0
                ? rows * this.slotSize +
                    (rows - 1) *
                    this.verticalSpacing
                : 0;


        this.contentHeight =
            gridStartY +
            gridHeight;
    }


    getHeight(): number {
        return this.contentHeight;
    }
}