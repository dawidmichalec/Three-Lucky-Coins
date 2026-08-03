import { Container, Text } from "pixi.js";
import { LocalizedText } from "../localization/LocalizedText";
import { ProbabilityDisplay } from "./components/ProbabilityDisplay";
import { DealerCard } from "./components/dealerCard/DealerCard";
import { BEN_DATA } from "../game/dealers/DealerRegistry";
import { DealerSkillsPanel } from "./panels/dealer/DealerSkillsPanel";
import { DealerObjectivePanel } from "./panels/dealer/DealerObjectivePanel";

export class GameUI extends Container {
    private balanceValue: Text;
    private betValue: Text;
    private combinationValue: Text;
    private wonAmount: Text;
    private multiplierValue: Text;
    private probabilityDisplay!: ProbabilityDisplay;
    private dealerCard!: DealerCard;
    private dealerSkillsPanel!: DealerSkillsPanel;
    private dealerObjectivePanel!: DealerObjectivePanel;

    constructor () {
        super();

        // INIT FOR DEALER CARD

        this.init();

        // BALANCE TEXT

        const balanceLabel = new LocalizedText(
            "balance",
            {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0x4ca626,
                wordWrap: true,
            },
        );

        balanceLabel.position.set(367.9, 1043.5);

        // BALANCE VALUE TEXT

        this.balanceValue = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
            },
        });

        this.balanceValue.position.set(497.9, 1043.5);

        // BET LABEL

        const betLabel = new LocalizedText(
            "betLabel",
            {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0x4ca626,
                wordWrap: true,
            },
        );
        betLabel.anchor.set(0.25, 0);
        betLabel.position.set(985, 1043.5);

        // BET VALUE

        this.betValue = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
            },
        });

        this.betValue.anchor.set(0.75, 0);
        this.betValue.position.set(920, 1043.5);

        // COMBINATION

        const combinationLabel = new LocalizedText(
            "combinationLabel",
            {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0x4ca626,
            },
        );

        combinationLabel.position.set(1345, 1043.5);

        // COMBINATIONS TEXT

        this.combinationValue = new Text({
            text: 'H - H - H',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
            },
        });

        this.combinationValue.position.set(1525, 1043.5);

        // WON TEXT

        const wonLabel = new LocalizedText(
            "winLabel",
            {
                font: 'Open Sans',
                fontSize: 34,
                fontWeight: 'bold',
                fill: 0xffffff,
                wordWrap: true,

                dropShadow: {
                    alpha: 0.8,
                    blur: 8,
                    color: '#00ffcc',
                    distance: 0,
                }
            },
        );

        wonLabel.anchor.set(1,0.5);
        wonLabel.position.set(950, 720);

        this.wonAmount = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 34,
                fontWeight: 'bold',
                fill: 0xffffff,

                dropShadow: {
                    alpha: 1,
                    blur: 15,
                    color: '#00ffcc', 
                    distance: 0,
                },
                
            },
        });

        this.wonAmount.anchor.set(0, 0.5);
        this.wonAmount.position.set(980, 720);


        // MULTIPLIER TEXT

        const multiplierLabel = new LocalizedText(
            "multiplier",
            {
                fontFamily: 'Oswald-Bold',
                fontSize: 38,
                fontWeight: 'bold',
                fill: 0xffffff,
                wordWrap: true,
                dropShadow: {
                    alpha: 0.8,
                    blur: 8,
                    color: '#ffaa00',
                    distance: 0,
                }
            },
        );

        multiplierLabel.anchor.set(0, 0);
        multiplierLabel.position.set(342, 437.5);

        // MULTIPLIER VALUE

        this.multiplierValue = new Text({
            text: 'x1',
            style: {
                font: 'Open Sans',
                fontSize: 124,
                fontWeight: 'bold',
                fill: 0xffffff,
                wordWrap: true,

                dropShadow: {
                    alpha: 1,
                    blur: 15,
                    color: '#ffaa00',
                    distance: 0,
                },
   
                stroke: {
                    color: '#331100',
                    width: 3,
                }
            },
        });

        this.multiplierValue.position.set(350, 492.9);

        // PROBABILITY DISPLAY

        this.probabilityDisplay = new ProbabilityDisplay(445, 600);
        this.probabilityDisplay.position.set(1474.8, 201.6);

        // SKILLS PANEL

        this.dealerSkillsPanel = new DealerSkillsPanel(626, 600);
        this.dealerSkillsPanel.position.set(1170, 188.4);
        this.dealerSkillsPanel.zIndex = 500;

        // OBJECTIVE PANEL

        this.dealerObjectivePanel = new DealerObjectivePanel(626, 140.1);
        this.dealerObjectivePanel.position.set(1170, 258.4);
        this.dealerObjectivePanel.zIndex = 500;

        this.sortableChildren = true;

        // ADD

        this.addChild(
            balanceLabel,
            this.balanceValue,
            betLabel,
            this.betValue,
            combinationLabel,
            this.combinationValue,
            wonLabel,
            this.wonAmount,
            multiplierLabel,
            this.multiplierValue,
            this.probabilityDisplay,
            this.dealerSkillsPanel,
            this.dealerObjectivePanel
        );
    }

    async init(){

        await this.createDealerCard();

    }

    private async createDealerCard(){

        this.dealerCard = new DealerCard(
            BEN_DATA,
            () => {
                this.dealerSkillsPanel.show();
                this.dealerObjectivePanel.hide();
            },

            () => {
                this.dealerObjectivePanel.show();
                this.dealerSkillsPanel.hide();
        });

        await this.dealerCard.init();

        this.dealerCard.position.set(
            697.3,
            108
        );

        this.addChild(this.dealerCard);

    }

    updateBalance(balance: number) {
        this.balanceValue.text = balance.toFixed(2);
    }

    updateBet(bet: number) {
        this.betValue.text = bet.toFixed(2);
    }

    updateCombination(combination: string) {
        this.combinationValue.text = combination;
    }

    updateWon(value: number) {
        this.wonAmount.text = value.toFixed(2);
    }

    updateMultiplier(multiplier: number) {
        this.multiplierValue.text = `x${multiplier}`;
    }
}