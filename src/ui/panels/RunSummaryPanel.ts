import { Container, Text } from "pixi.js";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { StatsManager } from "../../core/StatsManager";
import { Overlay } from "../popups/Overlay";
import { ScrollableContainer } from "../components/ScrollableContainer";


export class RunSummaryPanel extends Container {


    private statsManager: StatsManager;
    private statsScroll!: ScrollableContainer;
    private statsContent!: Container;
    private statsLabels!: Text;
    private statsValues!: Text;

    private combinationTitle!: Text;
    private combinationLabels!: Text;
    private combinationValues!: Text;


    constructor(
        width: number,
        height: number,
        private onPlayAgain:()=>void,
        private onQuit:()=>void
    ){

        super();


        this.statsManager =
            StatsManager.getInstance();


        this.createOverlay(width,height);

        this.createTitle();

        this.createStats();

        this.createButtons();


    }



    private createTitle(){

        const title = new Text({

            text:"Run Summary",

            style:{
                fill:0xffffff,
                font:'Open Sans',
                fontSize:52,
                fontWeight:"bold"
            }

        });


        title.anchor.set(0.5);

        title.position.set(
            window.innerWidth/2,
            80
        );


        this.addChild(title);

    }



    refresh(){


        const stats =
            this.statsManager.getRunStats();



        this.statsValues.text =
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


            labels +=
    `
    ${combo.split(" - ").join(" - ")}`;


            values +=
    `
    ${count}`;

        }



        this.combinationLabels.text =
            labels;


        this.combinationValues.text =
            values;



        this.statsScroll.refresh();

    }



    private createStats(){


        this.statsScroll =
            new ScrollableContainer(
                1000,
                400
            );


        this.statsScroll.position.set(
            300,
            150
        );



        this.statsLabels =
            new Text({

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



        this.statsLabels.position.set(
            0,
            0
        );



        this.statsValues =
            new Text({

                text:"",

                style:{
                    fill:0xffffff,
                    font:'Open Sans',
                    fontSize:24,
                    fontWeight: 'bold',
                    lineHeight:36
                }

            });



        this.statsValues.position.set(
            600,
            0
        );



        this.combinationTitle =
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


        this.combinationTitle.position.set(
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
            0,
            390
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
            600,
            390
        );



        this.statsScroll.addContent(
            this.statsLabels
        );

        this.statsScroll.addContent(
            this.statsValues
        );

        this.statsScroll.addContent(
            this.combinationTitle
        );

        this.statsScroll.addContent(
            this.combinationLabels
        );

        this.statsScroll.addContent(
            this.combinationValues
        );


        this.addChild(
            this.statsScroll
        );


        this.refresh();

    }



    private createButtons(){


        const playAgain =
            new RoundedButton({

                text:"Play Again",

                theme:ButtonTheme.GREEN,

                onClick:()=>{

                    this.onPlayAgain();

                }

            });



        playAgain.position.set(
            300,
            560
        );



        const quit =
            new RoundedButton({

                text:"Quit To Main Menu",

                theme:ButtonTheme.RED,

                onClick:()=>{

                    this.onQuit();

                }

            });



        quit.position.set(
            970,
            560
        );



        this.addChild(
            playAgain,
            quit
        );

    }

    private createOverlay(width:number,height:number){

        const overlay = new Overlay(
            width,
            height
        );

        this.addChild(overlay);

    }


}