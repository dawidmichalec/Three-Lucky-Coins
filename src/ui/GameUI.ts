import { Container, Text } from "pixi.js";
import { LocalizedText } from "../localization/LocalizedText";
import { ProbabilityDisplay } from "./components/ProbabilityDisplay";
import { DealerCard } from "./components/dealerCard/DealerCard";
import { DealerData } from "../game/dealers/DealerData";
import { DealerSkillsPanel } from "./panels/dealer/DealerSkillsPanel";
import { DealerObjectivePanel } from "./panels/dealer/DealerObjectivePanel";
import { PerkContainer } from "./components/PerkContainer";
import { OddsTable } from "../game/probability/OddsTypes";
import { MultiplierEffect } from "./effects/MultiplierEffect";

export class GameUI extends Container {
    private balanceValue: Text;
    private betValue: Text;
    private combinationValue: Text;
    private wonAmount: Text;
    private multiplierValue: Text;
    private multiplierContainer: Container;

    private currentMultiplier = 1;
    private multiplierAnimationId?: number;
    private probabilityDisplay!: ProbabilityDisplay;
    private dealerCard!: DealerCard;
    private dealerSkillsPanel!: DealerSkillsPanel;
    private dealerObjectivePanel!: DealerObjectivePanel;
    private perksContainer!: PerkContainer;
    private bonusesContainer!: PerkContainer;
    private effectsContainer!: PerkContainer;

    private multiplierEffect:MultiplierEffect;

    constructor (
        private currentDealer: DealerData
    ) {
        super();

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
                fontSize: 38,
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
        wonLabel.position.set(950, 571);

        this.wonAmount = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 38,
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
        this.wonAmount.position.set(980, 571);


        // MULTIPLIER TEXT

        const multiplierLabel = new LocalizedText(
            "multiplier",
            {
                fontFamily: 'Anek-Kannada Bold',
                fontSize: 46,
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
        multiplierLabel.position.set(329.9, 324.8);

        // MULTIPLIER VALUE

        this.multiplierContainer = new Container();

        this.multiplierContainer.position.set(
            430,
            455
        );
        

        this.multiplierEffect = new MultiplierEffect();

        /*
            MultiplierEffect będzie dzieckiem tego samego
            kontenera, więc punkt 0,0 jest środkiem mnożnika.
        */

        this.multiplierContainer.addChildAt(
            this.multiplierEffect,
            0
        );


        this.multiplierValue = new Text({
            text: "x1",
            style: {
                fontFamily: "JackCondensed",
                fontSize: 128,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,

                dropShadow: {
                    alpha: 1,
                    blur: 15,
                    color: "#ffaa00",
                    distance: 0,
                },

                stroke: {
                    color: "#331100",
                    width: 3,
                }
            },
        });

        this.multiplierValue.anchor.set(0.5);

        this.multiplierContainer.addChild(
            this.multiplierValue
        );


        // PROBABILITY DISPLAY

        this.probabilityDisplay = new ProbabilityDisplay(445, 600);
        this.probabilityDisplay.position.set(1474.8, 201.6);

        // SKILLS PANEL

        this.dealerSkillsPanel = new DealerSkillsPanel(626, 600);
        this.dealerSkillsPanel.position.set(1170, 188.4);
        this.dealerSkillsPanel.zIndex = 500;
        this.dealerSkillsPanel.setDealer(this.currentDealer);

        // OBJECTIVE PANEL

        this.dealerObjectivePanel = new DealerObjectivePanel(626, 140.1);
        this.dealerObjectivePanel.position.set(1170, 258.4);
        this.dealerObjectivePanel.zIndex = 500;
        this.dealerObjectivePanel.setDealer(this.currentDealer);

        this.sortableChildren = true;

        // PERKS CONTAINER

        this.perksContainer = new PerkContainer(300, 180);
        this.perksContainer.position.set(477.9, 656.2);


        // PERKS LABEL

        const perksLabel = new LocalizedText(
            "perks",
            {
                fontFamily: "EgyptianSlateBd",
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        )

        perksLabel.anchor.set(0,0);
        perksLabel.position.set(579.8, 844.8);


        // BONUSES CONTAINER

        this.bonusesContainer = new PerkContainer(300, 180);
        this.bonusesContainer.position.set(822.9, 656.2);


        // BONUSES LABEL

        const bonusesLabel = new LocalizedText(
            "bonuses",
            {
                fontFamily: "EgyptianSlateBd",
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        );

        bonusesLabel.anchor.set(0,0);
        bonusesLabel.position.set(917.3, 844.8);


        // EFFECTS CONTAINER

        this.effectsContainer = new PerkContainer(300, 180);
        this.effectsContainer.position.set(1167.9, 656.2);

        
        // EFFECTS LABEL

        const effectsLabel = new LocalizedText(
            "effects",
            {
                fontFamily: "EgyptianSlateBd",
                fontSize: 28,
                fontWeight: 'bold',
                fill: 0xffffff
            }
        )

        effectsLabel.anchor.set(0, 0);
        effectsLabel.position.set(1259.5, 844.8);



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
            this.multiplierContainer,
            this.probabilityDisplay,
            this.dealerSkillsPanel,
            this.dealerObjectivePanel,
            this.perksContainer,
            perksLabel,
            this.bonusesContainer,
            bonusesLabel,
            this.effectsContainer,
            effectsLabel
        );

        void this.init();
    }

    async init(){

        await this.createDealerCard();

    }

    private async createDealerCard() {

        this.dealerCard =
            new DealerCard(
                this.currentDealer,

                () => {

                    this.dealerSkillsPanel.show();
                    this.dealerObjectivePanel.hide();

                },

                () => {

                    this.dealerObjectivePanel.show();
                    this.dealerSkillsPanel.hide();

                }
            );

        await this.dealerCard.init();

        this.dealerCard.position.set(
            697.3,
            108
        );

        this.addChild(
            this.dealerCard
        );
    }

    setDisabled(value: boolean) {

        this.dealerCard.setDisabled(value);
        if (this.dealerSkillsPanel.visible === true || this.dealerObjectivePanel.visible === true) {
            this.dealerSkillsPanel.visible = false;
            this.dealerObjectivePanel.visible = false;
        }

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

    updateMultiplier(
        multiplier: number
    ) {

        const previousMultiplier =
            this.currentMultiplier;


        this.currentMultiplier =
            multiplier;


        this.multiplierValue.text =
            `x${multiplier}`;


        if (
            multiplier >
            previousMultiplier
        ) {

            this.animateMultiplierIncrease();


            /*
                MultiplierEffect sam sprawdzi,
                czy wartość jest wielokrotnością 5.
            */

            this.multiplierEffect.play(
                multiplier
            );

        }
    }

    updateProbability(
        odds: OddsTable
    ) {

        this.probabilityDisplay
            .updateOdds(odds);
    }


    private animateMultiplierIncrease() {

        /*
            Jeśli poprzednia animacja jeszcze trwa,
            zatrzymujemy ją i zaczynamy od początku.
        */
        if (
            this.multiplierAnimationId !==
            undefined
        ) {

            cancelAnimationFrame(
                this.multiplierAnimationId
            );

        }

        const duration = 320;

        const startTime =
            performance.now();

        const animate = (
            currentTime: number
        ) => {

            const progress =
                Math.min(
                    1,
                    (
                        currentTime -
                        startTime
                    ) / duration
                );

            /*
                Powiększenie:
                1 → około 1.18 → 1
            */
            const punch =
                Math.sin(
                    progress * Math.PI
                );

            const scale =
                1 + punch * 0.18;

            this.multiplierContainer.scale.set(
                scale
            );

            /*
                Trzęsienie najmocniejsze na początku,
                a później stopniowo zanika.
            */
            const shakeStrength =
                (1 - progress) * 7;

            const shakeX =
                Math.sin(
                    progress *
                    Math.PI *
                    12
                ) * shakeStrength;

            const shakeY =
                Math.cos(
                    progress *
                    Math.PI *
                    16
                ) * shakeStrength * 0.35;

            this.multiplierValue.position.set(
                shakeX,
                shakeY
            );

            if (progress < 1) {

                this.multiplierAnimationId =
                    requestAnimationFrame(
                        animate
                    );

                return;
            }

            /*
                Zawsze przywracamy stan bazowy.
            */
            this.multiplierContainer.scale.set(1);

            this.multiplierValue.position.set(
                0,
                0
            );

            this.multiplierAnimationId =
                undefined;
        };

        this.multiplierAnimationId =
            requestAnimationFrame(
                animate
            );
    }
}