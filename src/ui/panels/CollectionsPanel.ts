import { Container, Text} from "pixi.js";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { StatsManager } from "../../core/StatsManager";
import { Overlay } from "../popups/Overlay";
import { ScrollableContainer } from "../components/ScrollableContainer";
import { ClosePanelButton } from "../buttons/ClosePanelButton";
import { LocalizedText } from "../../localization/LocalizedText";
import { LocalizationManager } from "../../core/LocalizationManager";
import { TranslationKey } from "../../core/LocalizationManager";
import { DealerCollectionContent } from "./collections/dealers/DealersCollectionContent";
import { DealerData } from "../../game/dealers/DealerData";
import { LayoutManager } from "../../core/LayoutManager";
import { DealerCollectionManager } from "../../game/dealers/collection/DealerCollectionManager";
import { CollectionDetailPanel } from "./collections/detail/CollectionDetailPanel";


export class CollectionsPanel extends Container {

    private currentTab: "player" | "dealers" | "perks" = "player";
    private statsManager: StatsManager;
    private playerButton!: RoundedButton;
    private perksButton!: RoundedButton;
    private dealersButton!: RoundedButton;
    private scrollableContainer!: ScrollableContainer;

    private playerStatsValues!: Text;
    private combinationLabels!: Text;
    private combinationValues!: Text;

    private localization = LocalizationManager.getInstance();

    private readonly viewportWidth = 1000;
    private readonly viewportHeight = 450;

    private layoutManager = LayoutManager.getInstance();
    private dealerCollectionManager = DealerCollectionManager.getInstance();
    private lockedDealerTooltip!: LocalizedText;
    private lockedDealerTooltipTimeout?: ReturnType<typeof setTimeout>;
    private collectionDetailPanel!: CollectionDetailPanel;

    constructor(
        width: number,
        height: number, 
        private onClose: () => void
    ){
        super();

        this.statsManager = StatsManager.getInstance();

        this.createOverlay(width, height);

        this.createCloseButton();

        this.createButtons();

        this.createScrollableContainer();

        this.createCollectionDetailPanel();

        this.createLockedDealerTooltip();

        void this.refresh();

    }



    createButtons() {
        
        this.playerButton = new RoundedButton({

            text: "playerStats",

            theme:ButtonTheme.GOLD,

            onClick:()=> {
                this.showPlayerStats();
            }

        });

        this.playerButton.position.set(333.6, 108);


        this.dealersButton = new RoundedButton({

            text: "dealers",

            theme: ButtonTheme.GOLD,

            onClick:()=> {
                this.showDealerCollectionPanel();
            }

        });

        this.dealersButton.position.set(798, 108);


        this.perksButton = new RoundedButton({

            text: "perks",

            theme: ButtonTheme.GREEN,

            onClick:()=> {
                this.showPerksCollectionPanel();
            }

        })


        this.perksButton.position.set(1290.5, 108);

        this.addChild(
            this.playerButton,
            this.dealersButton,
            this.perksButton
        );

    }



    private createScrollableContainer() {

        this.scrollableContainer = new ScrollableContainer(
            this.viewportWidth,
            this.viewportHeight
        );

        this.scrollableContainer.position.set(
            (this.layoutManager.DESIGN_WIDTH - this.viewportWidth) / 2,
            293
        );

        this.addChild(
            this.scrollableContainer
        );
    }


    private createCollectionDetailPanel() {

        this.collectionDetailPanel =
            new CollectionDetailPanel(
                () => {
                    this.collectionDetailPanel.hide();
                }
            );

        this.collectionDetailPanel.zIndex = 5000;

        this.addChild(
            this.collectionDetailPanel
        );
    }


    private createLockedDealerTooltip() {

        this.lockedDealerTooltip = new LocalizedText(
            "youNeedToUnlockThisDealerFirst",
            {
                font: "Open Sans",
                fontSize: 28,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        );

        this.lockedDealerTooltip.anchor.set(0.5);

        this.lockedDealerTooltip.position.set(
            this.layoutManager.DESIGN_WIDTH / 2,
            820
        );

        this.lockedDealerTooltip.visible = false;

        this.addChild(
            this.lockedDealerTooltip
        );
    }


    private showLockedDealerTooltip() {

        if (this.lockedDealerTooltipTimeout) {
            clearTimeout(
                this.lockedDealerTooltipTimeout
            );
        }

        this.lockedDealerTooltip.visible = true;

        this.lockedDealerTooltipTimeout = setTimeout(
            () => {
                this.lockedDealerTooltip.visible = false;
            },
            1800
        );
    }


    async refresh(): Promise<void> {

        this.scrollableContainer.clearContent();


        switch (this.currentTab) {

            case "player":

                this.createPlayerStats();
                this.refreshPlayerStats();

                break;


            case "dealers":

                await this.createDealerCollection();

                break;


            case "perks":

                this.createPerkCollectionPlaceholder();

                break;
        }


        this.scrollableContainer.refresh();
    }


    private async createDealerCollection(): Promise<void> {

        const content = new DealerCollectionContent({
            width: this.viewportWidth,

            onDealerClick: dealer => {
                this.handleDealerClick(
                    dealer
                );
            }
        });


        await content.init();


        this.scrollableContainer.addContent(
            content
        );
    }


    private handleDealerClick(dealer: DealerData) {

        const isDiscovered =
            this.dealerCollectionManager.isDealerDiscovered(
                dealer.id
            );

        if (!isDiscovered) {
            this.showLockedDealerTooltip();
            return;
        }

        void this.collectionDetailPanel.showDealer(
            dealer
        );
    }
    

    private createPerkCollectionPlaceholder() {

        const placeholder = new LocalizedText(
            "perks",
            {
                fontFamily: "Open Sans",
                fontSize: 32,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        );

        this.scrollableContainer.addContent(
            placeholder
        );
    }



    private refreshPlayerStats(){

        const stats =
            this.statsManager.getPlayerStats();

        this.playerStatsValues.text =
    `    ${stats.runs}
    ${stats.runsWon}
    ${stats.runsLost}
    ${this.statsManager.getWinRateAllTime()}    
    ${stats.bestWinStreak}
    ${stats.biggestLoseStreak}
    ${stats.totalWon.toFixed(2)}
    ${stats.totalLost.toFixed(2)}
    ${stats.highestWin.toFixed(2)}
    ${this.statsManager.getAverageWinAllTime()}
    ${this.statsManager.getAccuracyAllTime().toFixed(2)}%
    ${stats.totalBets}
    ${this.statsManager.getFavoriteBetAllTime() ?? "-"}
    ${this.statsManager.getAverageBetValueAllTime().toFixed(2)}
    ${this.statsManager.getFormattedFastestRun()}
    ${stats.totalCoinsTossed}
    ${this.statsManager.getFormattedTotalPlayTime()}
    ${stats.sessionsPlayed}
    ${this.localization.t(
        this.statsManager.getAddictionRank()
    )}
    ${this.statsManager.getFavoriteCombinationAllTime() ?? "-"}
    ${this.statsManager.getLuckiestCombinationAllTime() ?? "-"}
    `;

         const combinations =
            Object.entries(
                stats.combinationUsage
            )
            .sort(
                (a,b)=>b[1]-a[1]
            );



        let labels = "";
        let values = "";


        for(const [combo,count] of combinations){

            labels +=`${combo}\n`;

            values +=`${count}\n`;

        }



        this.combinationLabels.text = labels;

        this.combinationValues.text = values;


        this.scrollableContainer.refresh();

    }



    private createPlayerStats() {

        const labels = new Text({

            text:
            this.localization.tList([

                "numberOfRuns",
                "runsWon",
                "runsLost",
                "winRate",
                "bestStreak",
                "biggestLosingStreakAllTime",
                "totalWonAllTime",
                "totalLostAllTime",
                "highestWin",
                "averageWinAllTime",
                "accuracy",
                "totalBets",
                "favoriteBet",
                "averageBetValueAllTime",
                "fastestRun",
                "totalCoinsTossed",
                "totalPlayTime",
                "sessionsPlayed",
                "addictionRank",
                "favoriteCombination",
                "luckiestCombination"

            ]),

            style:{
                fill:0xffffff,
                font:'Open Sans',
                fontSize:24,
                fontWeight:'bold',
                lineHeight:36
            }

        });



        labels.position.set(0,0);


        this.playerStatsValues =
            new Text({

                text:"",

                style:{
                    fill:0xffffff,
                    font:'Open Sans',
                    fontSize:24,
                    fontWeight:'bold',
                    lineHeight:36
                }

            });


        this.playerStatsValues.position.set(
            760,
            0
        );


        const statsCount = 21;

        const y = statsCount * 36 + 15;


        const combinationTitle =
            new LocalizedText(

                "combinationUsage",

                {
                    fill:0xffffff,
                    font:'Open Sans',
                    fontSize:24,
                    fontWeight:'bold',
                    lineHeight:36
                }

            );



        combinationTitle.position.set(
            0,
            y
        );



        this.combinationLabels =
            new Text({

                text:"",

                style:{
                    fill:0xffffff,
                    font:'Open Sans',
                    fontSize:24,
                    fontWeight:'bold',
                    lineHeight:36
                }

            });


        this.combinationLabels.position.set(
            25,
            y + 40
        );



        this.combinationValues =
            new Text({

                text:"",

                style:{
                    fill:0xffffff,
                    font:'Open Sans',
                    fontSize:24,
                    fontWeight:'bold',
                    lineHeight:36
                }

            });


        this.combinationValues.position.set(
            785,
            y + 40
        );


        this.scrollableContainer.addContent(labels);
        this.scrollableContainer.addContent(this.playerStatsValues);

        this.scrollableContainer.addContent(combinationTitle);
        this.scrollableContainer.addContent(this.combinationLabels);
        this.scrollableContainer.addContent(this.combinationValues);

    }



    private showPlayerStats() {

        this.currentTab = "player";

        this.playerButton.setTheme(ButtonTheme.DARKGOLD);
        this.dealersButton.setTheme(ButtonTheme.GOLD);
        this.perksButton.setTheme(ButtonTheme.GOLD);

        void this.refresh();
    }



    private showDealerCollectionPanel() {

        this.currentTab = "dealers";

        this.playerButton.setTheme(ButtonTheme.GOLD);
        this.dealersButton.setTheme(ButtonTheme.DARKGOLD);
        this.perksButton.setTheme(ButtonTheme.GOLD);

        void this.refresh();

    }

    private showPerksCollectionPanel(){

        this.currentTab = "perks";

        this.playerButton.setTheme(ButtonTheme.GOLD);
        this.dealersButton.setTheme(ButtonTheme.GOLD);
        this.perksButton.setTheme(ButtonTheme.DARKGOLD);

        void this.refresh();


    }



    async createCloseButton() {
        const close = new ClosePanelButton();

        await close.init();

        close.on("pointerdown", () => {
            close.scale.set(0.95);
        });

        close.on("pointerup", () => {
            close.scale.set(1);
        });

        close.on("pointerupoutside", () => {
            close.scale.set(1);
        });

        close.on("pointertap", () => {
            this.hide();
        });

        close.position.set(
            1750,
            108
        );

        this.addChild(close);
    }

    private createOverlay(width:number,height:number){

        const overlay = new Overlay(
            width,
            height
        );

        this.addChild(overlay);

    }

    show(){

        this.currentTab = "player";

        this.playerButton.setTheme(ButtonTheme.DARKGOLD);
        this.dealersButton.setTheme(ButtonTheme.GOLD);
        this.perksButton.setTheme(ButtonTheme.GOLD);

        void this.refresh();


        this.visible = true;

    }


    hide(){

        this.lockedDealerTooltip.visible = false;

        if (this.lockedDealerTooltipTimeout) {
            clearTimeout(
                this.lockedDealerTooltipTimeout
            );

            this.lockedDealerTooltipTimeout = undefined;
        }

        this.visible = false;

    }
}