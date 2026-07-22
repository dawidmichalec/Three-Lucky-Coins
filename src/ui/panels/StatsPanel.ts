import { Container, Text } from "pixi.js";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { StatsManager } from "../../core/StatsManager";
import { Overlay } from "../popups/Overlay";
import { ScrollableContainer } from "../components/ScrollableContainer";
import { ClosePanelButton } from "../buttons/ClosePanelButton";

export class StatsPanel extends Container {

    private currentTab: "run" | "player" = "run";
    private runButton!: RoundedButton;
    private playerButton!: RoundedButton;

    private statsManager: StatsManager;
    private statsScroll!: ScrollableContainer;
    private runStatsValues!: Text;
    private playerStatsValues!: Text;

    private combinationLabels!: Text;
    private combinationValues!: Text;


    constructor(
        width: number,
        height: number, 
        private onClose: () => void
    ) {
        super();

        this.statsManager =
            StatsManager.getInstance();


        this.createOverlay(width, height);

        this.createCloseButton();

        this.createButtons();

        this.createStatsContainer();

        this.refresh();


    }

    private createButtons() {

        this.runButton = new RoundedButton({
            text: "Run Stats",
            theme: ButtonTheme.DARKGREEN,
            onClick: () => {
                this.showRunStats();
            }
        });

        this.runButton.position.set(508.6, 108);

        this.playerButton = new RoundedButton({
            text: "Player Stats",
            theme: ButtonTheme.GREEN,
            onClick: () => {
                this.showPlayerStats();
            }
        })

        this.playerButton.position.set(1097.9, 108);

        this.addChild(
            this.runButton,
            this.playerButton
        );


    }

    refresh() {

        this.statsScroll.clearContent();

        if(this.currentTab === "run") {

            this.createRunStats();

            this.refreshRunStats();

        }
        else {

            this.createPlayerStats();

            this.refreshPlayerStats();

        }

    }


    private refreshRunStats(){


        const stats =
            this.statsManager.getRunStats();



        this.runStatsValues.text =
    `
    ${stats.bestWinStreak}
    ${stats.biggestLoseStreak}
    ${stats.highestWin.toFixed(2)}
    ${this.statsManager.getAccuracyCurrentRun().toFixed(2)}%
    ${stats.totalBets}
    ${this.statsManager.getFavoriteBetCurrentRun() ?? "-"}
    ${this.statsManager.getFormattedRunDuration()}
    ${this.statsManager.getFavoriteCombinationCurrentRun() ?? "-"}
    ${this.statsManager.getLuckiestCombinationCurrentRun() ?? "-"}
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


        this.statsScroll.refresh();

    }



    private createRunStats(){


        const labels = new Text({

            text:
    `
    Best Streak
    Biggest Losing Streak
    Highest Win
    Accuracy
    Total Bets
    Favorite Bet
    Run Duration
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



        this.runStatsValues =
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


        this.runStatsValues.position.set(
            760,
            0
        );



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
            370
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
            410
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
            410
        );



        this.statsScroll.addContent(labels);
        this.statsScroll.addContent(this.runStatsValues);

        this.statsScroll.addContent(combinationTitle);
        this.statsScroll.addContent(this.combinationLabels);
        this.statsScroll.addContent(this.combinationValues);

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
    ${this.statsManager.getFavoriteBetAllTime() ?? "-"}
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


        this.statsScroll.refresh();

    }



    private createPlayerStats(){

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
            760,
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
            785,
            y + 40
        );


        this.statsScroll.addContent(labels);
        this.statsScroll.addContent(this.playerStatsValues);

        this.statsScroll.addContent(combinationTitle);
        this.statsScroll.addContent(this.combinationLabels);
        this.statsScroll.addContent(this.combinationValues);

    }



    private createStatsContainer(){

        this.statsScroll =
        new ScrollableContainer(
            1000,
            450
        );


        this.statsScroll.position.set(
            312,
            283
        );


        this.addChild(
            this.statsScroll
        );

    }

    private showRunStats() {

        this.currentTab = "run";

        this.runButton.setTheme(ButtonTheme.DARKGREEN);
        this.playerButton.setTheme(ButtonTheme.GREEN);

        this.refresh();
    }

    private showPlayerStats() {

        this.currentTab = "player";

        this.playerButton.setTheme(ButtonTheme.DARKGREEN);
        this.runButton.setTheme(ButtonTheme.GREEN);

        this.refresh();
    }

    async createCloseButton() {
        const close = new ClosePanelButton();

        await close.init();

        close.on("click", () => {
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

        this.currentTab = "run";

        this.runButton.setTheme(ButtonTheme.DARKGREEN);
        this.playerButton.setTheme(ButtonTheme.GREEN);

        this.refresh();

        this.visible = true;

    }


    hide(){

        this.visible = false;

    }


}