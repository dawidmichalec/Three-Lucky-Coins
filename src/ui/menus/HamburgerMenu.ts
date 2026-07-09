import { Container, Sprite, Assets } from "pixi.js";
import { HamburgerMenuButton } from "../buttons/HamburgerMenuButton";
import { StatsButton } from "../buttons/StatsButton";
import { SoundButton } from "../buttons/SoundButton";
import { HelpButton } from "../buttons/HelpButton";
import { RestartRunButton } from "../buttons/RestartRunButton";

export class HamburgerMenu extends Container{

    private hamburgerMenuButton!: HamburgerMenuButton;
    private statsButton!: StatsButton;
    private soundButton!: SoundButton;
    private helpButton!: HelpButton;
    private restartRunButton!: RestartRunButton;

    constructor(){
        super();

        this.createHamburgerMenuButton();
        this.createStatsButton();
        this.createSoundButton();
        this.createHelpButton();
        this.createRestartRunButton();
    }

    private async createHamburgerMenuButton() {
        this.hamburgerMenuButton = new HamburgerMenuButton();

        await this.hamburgerMenuButton.init();

        this.hamburgerMenuButton.position.set(40, 560);
        
        this.hamburgerMenuButton.on("click", () => {

            this.toggle();

        });

        this.addChild(this.hamburgerMenuButton);
    }

    private async createStatsButton(){
        this.statsButton = new StatsButton;

        await this.statsButton.init();

        this.statsButton.position.set(55, 490);

        this.addChild(this.statsButton);
    }

    private async createSoundButton(){
        this.soundButton = new SoundButton();

        await this.soundButton.init();

        this.soundButton.position.set(45, 400);

        this.addChild(this.soundButton);
    }

    private async createHelpButton(){
        this.helpButton = new HelpButton();

        await this.helpButton.init();

        this.helpButton.position.set(50, 320);

        this.addChild(this.helpButton);
    }

    private async createRestartRunButton(){
        this.restartRunButton = new RestartRunButton();

        await this.restartRunButton.init();

        this.restartRunButton.position.set(45, 225);

        this.addChild(this.restartRunButton);
    }
}