import { Container, Sprite, Assets } from "pixi.js";
import { HamburgerMenuButton } from "../buttons/HamburgerMenuButton";
import { StatsButton } from "../buttons/StatsButton";
import { SettingsButton } from "../buttons/SettingsButton";
import { HelpButton } from "../buttons/HelpButton";
import { RestartRunButton } from "../buttons/RestartRunButton";
import { HomeButton } from "../buttons/HomeButton";
import { SceneManager } from "../../game/SceneManager";
import { PopupManager } from "../popups/PopupManager";

export class HamburgerMenu extends Container{

    private hamburgerMenuButton!: HamburgerMenuButton;
    private statsButton!: StatsButton;
    private settingsButton!: SettingsButton;
    private helpButton!: HelpButton;
    private restartRunButton!: RestartRunButton;
    private homeButton!: HomeButton;

    constructor(
        private sceneManager: SceneManager,
        private popupManager: PopupManager,
        private onOpenOptions: ()=>void,
        private onOpenStats: ()=>void
    ){
        super();

        this.init();

        this.sortableChildren = true;
    }

    private async init(){

        await this.createHamburgerMenuButton();
        await this.createStatsButton();
        await this.createSettingsButton();
        await this.createHelpButton();
        await this.createRestartRunButton();
        await this.createHomeButton();

    }

    private async createHamburgerMenuButton() {
        this.hamburgerMenuButton = new HamburgerMenuButton();

        await this.hamburgerMenuButton.init();

        this.hamburgerMenuButton.position.set(108, 905);

        this.hamburgerMenuButton.on("pointerdown", () => {
            this.hamburgerMenuButton.scale.set(0.95);
        });

        this.hamburgerMenuButton.on("pointerup", () => {
            this.hamburgerMenuButton.scale.set(1);
        });

        this.hamburgerMenuButton.on("pointerupoutside", () => {
            this.hamburgerMenuButton.scale.set(1);
        });

        this.hamburgerMenuButton.on("pointertap", () => {
            this.toggle();
        });

        this.addChild(this.hamburgerMenuButton);
    }

    private async createStatsButton(){
        this.statsButton = new StatsButton;

        await this.statsButton.init();

        this.statsButton.position.set(128, 830);

        this.statsButton.on("pointerdown", () => {
            this.statsButton.scale.set(0.95);
        });

        this.statsButton.on("pointerup", () => {
            this.statsButton.scale.set(1);
        });

        this.statsButton.on("pointerupoutside", () => {
            this.statsButton.scale.set(1);
        });

        this.statsButton.on("pointertap", () => {
            this.onOpenStats();
        });

        this.addChild(this.statsButton);
    }

    private async createSettingsButton(){
        this.settingsButton = new SettingsButton();

        await this.settingsButton.init();

        this.settingsButton.position.set(128, 740);

        this.settingsButton.on("pointerdown", () => {
            this.settingsButton.scale.set(0.95);
        });

        this.settingsButton.on("pointerup", () => {
            this.settingsButton.scale.set(1);
        });

        this.settingsButton.on("pointerupoutside", () => {
            this.settingsButton.scale.set(1);
        });

        this.settingsButton.on("pointertap", () => {
            this.onOpenOptions();
        });

        this.addChild(this.settingsButton);
    }

    private async createHelpButton(){
        this.helpButton = new HelpButton();

        await this.helpButton.init();

        this.helpButton.position.set(124, 645);

        this.addChild(this.helpButton);
    }

    private async createRestartRunButton(){
        this.restartRunButton = new RestartRunButton();

        await this.restartRunButton.init();

        this.restartRunButton.position.set(118, 545);

        this.restartRunButton.on("pointerdown", () => {
            this.restartRunButton.scale.set(0.95);
        });

        this.restartRunButton.on("pointerup", () => {
            this.restartRunButton.scale.set(1);
        });

        this.restartRunButton.on("pointerupoutside", () => {
            this.restartRunButton.scale.set(1);
        });

        this.restartRunButton.on("pointertap", ()=>{

            this.popupManager.showConfirmation(

                "Are you sure you want to restart run?\n\nAll current progress will be lost.",

                ()=> {

                    this.sceneManager.showGame();

                }

            );

        });

        this.addChild(this.restartRunButton);
    }

    private async createHomeButton(){
        this.homeButton = new HomeButton();

        await this.homeButton.init();

        this.homeButton.position.set(124, 460);

        this.homeButton.on("pointerdown", () => {
            this.homeButton.scale.set(0.95);
        });

        this.homeButton.on("pointerup", () => {
            this.homeButton.scale.set(1);
        });

        this.homeButton.on("pointerupoutside", () => {
            this.homeButton.scale.set(1);
        });

        this.homeButton.on("pointertap",()=>{

            this.popupManager.showConfirmation(

                    "Are you sure you want to exit to main menu?\n\nAll current progress will be lost.",

                    ()=>{

                        this.sceneManager.showMainMenu();

                    }

                );

        });

        this.addChild(this.homeButton);
    }

    setDisabled(value: boolean){
        this.hamburgerMenuButton.setDisabled(value);
        this.statsButton.setDisabled(value);
        this.settingsButton.setDisabled(value);
        this.helpButton.setDisabled(value);
        this.restartRunButton.setDisabled(value);
        this.homeButton.setDisabled(value);
        
    }

    toggle() {
        if (
            (this.statsButton.visible === false) && 
            (this.settingsButton.visible === false) && 
            (this.helpButton.visible === false) &&
            (this.restartRunButton.visible === false)){
                this.statsButton.visible = true;
                this.settingsButton.visible = true;
                this.helpButton.visible = true;
                this.restartRunButton.visible = true;
                this.homeButton.visible = true;
            } else {
                this.statsButton.visible = false;
                this.settingsButton.visible = false;
                this.helpButton.visible = false;
                this.restartRunButton.visible = false;
                this.homeButton.visible = false;
            }
    }
       
}