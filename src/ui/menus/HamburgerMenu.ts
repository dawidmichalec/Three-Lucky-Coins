import { Container, Sprite, Assets } from "pixi.js";
import { HamburgerMenuButton } from "../buttons/HamburgerMenuButton";
import { StatsButton } from "../buttons/StatsButton";
import { SoundButton } from "../buttons/SoundButton";
import { HelpButton } from "../buttons/HelpButton";
import { RestartRunButton } from "../buttons/RestartRunButton";
import { HomeButton } from "../buttons/HomeButton";

export class HamburgerMenu extends Container{

    private hamburgerMenuButton!: HamburgerMenuButton;
    private statsButton!: StatsButton;
    private soundButton!: SoundButton;
    private helpButton!: HelpButton;
    private restartRunButton!: RestartRunButton;
    private homeButton!: HomeButton;

    constructor(){
        super();

        this.createHamburgerMenuButton();
        this.createStatsButton();
        this.createSoundButton();
        this.createHelpButton();
        this.createRestartRunButton();
        this.createHomeButton();
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

    private async createHomeButton(){
        this.homeButton = new HomeButton();

        await this.homeButton.init();

        this.homeButton.position.set(50, 145);

        this.addChild(this.homeButton);
    }

    setDisabled(value: boolean){
        this.hamburgerMenuButton.setDisabled(value);
        this.statsButton.setDisabled(value);
        this.soundButton.setDisabled(value);
        this.helpButton.setDisabled(value);
        this.restartRunButton.setDisabled(value);
        this.homeButton.setDisabled(value);
        
    }

    toggle() {
        if (
            (this.statsButton.visible === false) && 
            (this.soundButton.visible === false) && 
            (this.helpButton.visible === false) &&
            (this.restartRunButton.visible === false)){
                this.statsButton.visible = true;
                this.soundButton.visible = true;
                this.helpButton.visible = true;
                this.restartRunButton.visible = true;
                this.homeButton.visible = true;
            } else {
                this.statsButton.visible = false;
                this.soundButton.visible = false;
                this.helpButton.visible = false;
                this.restartRunButton.visible = false;
                this.homeButton.visible = false;
            }
    }
}