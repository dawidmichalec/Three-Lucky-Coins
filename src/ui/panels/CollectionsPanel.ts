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
    private scrollableContainer!: ScrollableContainer;

    private playerStatsValues!: Text;
    private combinationLabels!: Text;
    private combinationValues!: Text;

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

        this.refresh();

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



    private createScrollableContainer() {


        this.scrollableContainer = 
        new ScrollableContainer(
            1000, 
            450
        );


        this.scrollableContainer.position.set(300, 180);

        this.addChild(this.scrollableContainer);


    }


    refresh() {

        this.scrollableContainer.clearContent();

        if(this.currentTab === "player") {

            this.createPlayerStats();

            this.refreshPlayerStats();

        }
        /* else if(this.currentTab === "add-ons") {

        
        }
        else {

        } */

    }



    private refreshPlayerStats(){

        const stats =
            this.statsManager.getPlayerStats();

        this.playerStatsValues.text =
    `
    ${stats.runs}
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
    ${this.statsManager.getFavoriteBetAllTime()}.00
    ${this.statsManager.getAverageBetValueAllTime().toFixed(2)}
    ${this.statsManager.getFormattedFastestRun()}
    ${stats.totalCoinsTossed}
    ${this.statsManager.getFormattedTotalPlayTime()}
    ${stats.sessionsPlayed}
    ${this.statsManager.getAddictionRank()}
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
    `
    Number of runs
    Runs Won
    Runs Lost
    Win Rate
    Best Streak
    Biggest Losing Streak All Time
    Total Won
    Total Lost
    Highest Win
    Average Win
    Accuracy
    Total Bets
    Favorite Bet
    Average Bet Value
    Fastest Run
    Total Coins Tossed
    Total Play Time
    Sessions Played
    Addiction Rank
    Favorite Combination
    Luckiest Combination
    `,

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
            600,
            0
        );


        const statsCount = 21;

        const y = statsCount * 36 + 45;


        const combinationTitle =
            new Text({

                text:"Combination Usage",

                style:{
                    fill:0xffffff,
                    font:'Open Sans',
                    fontSize:24,
                    fontWeight:'bold',
                    lineHeight:36
                }

            });



        combinationTitle.position.set(
            25,
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
            625,
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

        this.playerButton.setTheme(ButtonTheme.DARKGREEN);
        this.addOnsButton.setTheme(ButtonTheme.GREEN);
        this.achievementsButton.setTheme(ButtonTheme.GREEN);

        this.refresh();
    }



    private showAddOnsUnlocked() {

        this.currentTab = "add-ons";

        this.playerButton.setTheme(ButtonTheme.GREEN);
        this.addOnsButton.setTheme(ButtonTheme.DARKGREEN);
        this.achievementsButton.setTheme(ButtonTheme.GREEN);

        this.refresh();

    }

    private showAchievements(){

        this.currentTab = "achievements";

        this.playerButton.setTheme(ButtonTheme.GREEN);
        this.addOnsButton.setTheme(ButtonTheme.GREEN);
        this.achievementsButton.setTheme(ButtonTheme.DARKGREEN);

        this.refresh();


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