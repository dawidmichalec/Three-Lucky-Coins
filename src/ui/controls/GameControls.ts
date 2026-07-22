import { Container } from "pixi.js";
import { TriangleButton } from "../buttons/TriangleButton";
import { TossButton } from "../buttons/TossButton";

interface GameControlsOptions {
    onBetDown: () => void;
    onBetUp: () => void;
    onPrevCombo: () => void;
    onNextCombo: () => void;
    onToss: () => void;
}

export class GameControls extends Container {

    private betDown!: TriangleButton;
    private betUp!: TriangleButton;

    private prevCombo!: TriangleButton;
    private nextCombo!: TriangleButton;

    private tossButton!: TossButton;

    constructor(private options: GameControlsOptions){
        super();

        this.createBetButtons();
        this.createCombinationButtons();
        this.createTossButton();
    }

    // BET BUTTONS

    private createBetButtons() {
        const betDown = new TriangleButton({
            direction: 'left',
            label: '-',
            onClick: () => {
            this.options.onBetDown();
            },
        });

        const betUp = new TriangleButton({
            direction: 'right',
            label: '+',
            onClick: () => {
                this.options.onBetUp();
            },
        });

        betDown.position.set(835, 1038.4);
        betUp.position.set(1050, 1038.4);

        this.betDown = betDown;
        this.betUp = betUp;

        this.addChild(betDown, betUp);
    }

    // COMBINATIONS

    private createCombinationButtons() {

        const prevCombo = new TriangleButton({
            direction: 'left',
            label: '-',
            onClick: () => {
            this.options.onPrevCombo();
            },
        });

        const nextCombo = new TriangleButton({
            direction: 'right',
            label: '+',
            onClick: () => {
            this.options.onNextCombo();
            },
        });

        prevCombo.position.set(1280.1, 1038.4);
        nextCombo.position.set(1637.3, 1038.4);

        this.prevCombo = prevCombo;
        this.nextCombo = nextCombo;

        this.addChild(prevCombo, nextCombo);
    }

    // TOSS BUTTON
    
    private async createTossButton() {
        this.tossButton = new TossButton('BET');

        await this.tossButton.init();

        this.tossButton.position.set(1704.7, 861.8);

        this.addChild(this.tossButton);

        this.tossButton.on("toss", () => {
            this.options.onToss();
        });
    }

    setDisabled(value: boolean) {

        this.betDown.setDisabled(value);
        this.betUp.setDisabled(value);

        this.prevCombo.setDisabled(value);
        this.nextCombo.setDisabled(value);

        this.tossButton.setDisabled(value);
        
    }

    startTossAnimation() {
        this.tossButton.startAnimation();
    }

    update(delta: number) {
        if (this.tossButton) {
                this.tossButton.update(delta);
            }
    }

    
}