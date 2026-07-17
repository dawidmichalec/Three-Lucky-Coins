import { Container, Text } from "pixi.js";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { StatsManager } from "../../core/StatsManager";
import { Overlay } from "../popups/Overlay";
import { ScrollableContainer } from "../components/ScrollableContainer";
import { Button } from "@pixi/ui";

export class ColletionsPanel extends Container {

    private currentTab: "player" | "add-ons" | "achievements" = "player";
    private statsManager: StatsManager;
    private playerButton!: RoundedButton;
    private achievementsButton!: RoundedButton;
    private addOnsButton!: RoundedButton;

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

    }



    createButtons() {
        
        this.playerButton = new RoundedButton({

            text: "Player Stats",

            theme:ButtonTheme.GREEN,

            onClick:()=> {
                this.showPlayerStats();
            }

        });

        this.playerButton.position.set(300, 70);


        this.addOnsButton = new RoundedButton({

            text: "Add-Ons Unlocked",

            theme: ButtonTheme.GREEN,

            onClick:()=> {
                this.showAddOnsUnlocked();
            }

        });

        this.addOnsButton.position.set(650,70);


        this.achievementsButton = new RoundedButton({

            text: "Achievements",

            theme: ButtonTheme.GREEN,

            onClick:()=> {
                this.showAchievements();
            }

        })


        this.achievementsButton.position.set(1000, 70);

        this.addChild(
            this.playerButton,
            this.addOnsButton,
            this.achievementsButton
        );

    }



    private showPlayerStats() {

        this.currentTab = "player";

        this.playerButton.setTheme(ButtonTheme.DARKGREEN);
        this.addOnsButton.setTheme(ButtonTheme.GREEN);
        this.achievementsButton.setTheme(ButtonTheme.GREEN);

        //this.refresh();
    }



    private showAddOnsUnlocked() {

        this.currentTab = "add-ons";

        this.playerButton.setTheme(ButtonTheme.GREEN);
        this.addOnsButton.setTheme(ButtonTheme.DARKGREEN);
        this.achievementsButton.setTheme(ButtonTheme.GREEN);

        // this.refresh();

    }

    private showAchievements(){

        this.currentTab = "achievements";

        this.playerButton.setTheme(ButtonTheme.GREEN);
        this.addOnsButton.setTheme(ButtonTheme.GREEN);
        this.achievementsButton.setTheme(ButtonTheme.DARKGREEN);

        // this.refresh();


    }



    createCloseButton() {
        const close = new RoundedButton({

            text:"X",

            theme:ButtonTheme.BLACK,

            buttonWidth:70,
            buttonHeight:70,

            onClick:()=>{

                this.hide();

            }

        });

        close.position.set(
            1400,
            40
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

        this.playerButton.setTheme(ButtonTheme.DARKGREEN);
        this.addOnsButton.setTheme(ButtonTheme.GREEN);
        this.achievementsButton.setTheme(ButtonTheme.GREEN);

        this.visible = true;

    }


    hide(){

        this.visible = false;

    }
}