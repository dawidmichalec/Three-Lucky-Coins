import { PlayerStats } from "../stats/PlayerStats";
import { RunStats } from "../stats/RunStats";


export class StatsManager {

    private static instance: StatsManager;


    private playerStats: PlayerStats;

    private runStats: RunStats;



    static getInstance(): StatsManager {

        if (!StatsManager.instance) {

            StatsManager.instance =
                new StatsManager();

        }

        return StatsManager.instance;

    }



    private constructor() {

        this.playerStats = new PlayerStats();

        this.runStats = new RunStats();

    }

    // =========================
    // SESSION MANAGEMENT
    // =========================

    startSession(){

        this.playerStats.sessionsPlayed++;

    }



    // =========================
    // RUN MANAGEMENT
    // =========================


    startRun() {

        this.runStats = new RunStats();

    }



    finishRun() {

        this.runStats.finishedAt = Date.now();


        this.playerStats.runs++;

        const duration =
            this.runStats.finishedAt -
            this.runStats.startedAt;

        if(this.runStats.won){

            if(duration < this.playerStats.fastestRun){

                this.playerStats.fastestRun = duration;

            }

            this.playerStats.runsWon++;

        }
        else {

            this.playerStats.runsLost++;

        }

        this.playerStats.totalPlayTime += duration;

    }



    // =========================
    // BETS
    // =========================


    recordBet(value:number) {


        // RUN

        this.runStats.totalBets++;

        this.runStats.totalBetValue += value;


        this.runStats.betUsage[value] =
            (this.runStats.betUsage[value] || 0) + 1;



        // PLAYER

        this.playerStats.totalBets++;

        this.playerStats.totalBetValue += value;


        this.playerStats.betUsage[value] =
            (this.playerStats.betUsage[value] || 0) + 1;

    }


    recordSuccessfulBet(){

        this.runStats.successfulBets++;

        this.playerStats.successfulBets++;

    }




    // =========================
    // WIN / LOSS
    // =========================


    recordWin(amount:number) {


        // RUN

        this.runStats.wins++;

        this.runStats.totalWon += amount;

        console.log(
            "recordWin",
            amount
        );


        this.runStats.highestWin =
            Math.max(
                this.runStats.highestWin,
                amount
            );



        // PLAYER

        this.playerStats.totalWon += amount;


        this.playerStats.highestWin =
            Math.max(
                this.playerStats.highestWin,
                amount
            );

    }



    recordLoss(amount:number) {


        this.runStats.losses++;

        this.runStats.totalLost += amount;


        this.playerStats.totalLost += amount;

    }





    // =========================
    // STREAKS
    // =========================


    recordWinStreak(streak:number) {


        this.runStats.currentWinStreak = streak;

        console.log(
            "recordWinStreak",
            streak
        );


        this.runStats.bestWinStreak =
            Math.max(
                this.runStats.bestWinStreak,
                streak
            );


        this.playerStats.bestWinStreak =
            Math.max(
                this.playerStats.bestWinStreak,
                streak
            );

    }



    recordLoseStreak(streak:number) {


        this.runStats.currentLoseStreak = streak;


        this.runStats.biggestLoseStreak =
            Math.max(
                this.runStats.biggestLoseStreak,
                streak
            );


        this.playerStats.biggestLoseStreak =
            Math.max(
                this.playerStats.biggestLoseStreak,
                streak
            );

    }





    // =========================
    // COMBINATIONS
    // =========================


    recordCombination(combo:string) {


        this.runStats.combinationUsage[combo] =
            (this.runStats.combinationUsage[combo] || 0) + 1;



        this.playerStats.combinationUsage[combo] =
            (this.playerStats.combinationUsage[combo] || 0) + 1;

    }



    recordWinningCombination(combo:string) {


        this.runStats.winningCombinationUsage[combo] =
            (this.runStats.winningCombinationUsage[combo] || 0) + 1;



        this.playerStats.winningCombinationUsage[combo] =
            (this.playerStats.winningCombinationUsage[combo] || 0) + 1;

    }




    // =========================
    // COINS
    // =========================


    recordCoinsTossed(amount:number){

        this.playerStats.totalCoinsTossed += amount;

    }





    // =========================
    // GETTERS
    // =========================


    getPlayerStats(){

        return this.playerStats;

    }


    getRunStats(){

        return this.runStats;

    }



    getWinRateAllTime(){


        if(this.playerStats.runs === 0)
            return 0;


        return (
            this.playerStats.runsWon /
            this.playerStats.runs
        );

    }




    getAccuracyAllTime(){


        const total =
            this.playerStats.totalBets;


        if(total === 0)
            return 0;


        return Math.round(
            (this.playerStats.successfulBets /
            total) * 100
        );

    }




    getAverageWinAllTime(){


        if(this.playerStats.runsWon === 0)
            return 0;


        return (
            this.playerStats.totalWon /
            this.playerStats.runsWon
        );

    }




    getAverageBetValueAllTime(){


        if(this.playerStats.totalBets === 0)
            return 0;


        return (
            this.playerStats.totalBetValue /
            this.playerStats.totalBets
        );

    }


    getFavoriteBetCurrentRun(){
        
        return this.formatBet(
            this.getMostUsed(this.runStats.betUsage)
        );

    }




    getFavoriteBetAllTime(){

        return this.formatBet(
            this.getMostUsed(this.playerStats.betUsage)
        );

    }


    getFavoriteCombinationCurrentRun() {

        return this.getMostUsed(
            this.runStats.combinationUsage
        );

    }


    getLuckiestCombinationCurrentRun() {

        return this.getMostUsed(
            this.runStats.winningCombinationUsage
        );

    }


    getAccuracyCurrentRun() {

        if (this.runStats.totalBets === 0)
            return 0;

        return Math.round(
            (this.runStats.successfulBets /
            this.runStats.totalBets) * 100
        );

    }

    getAverageBetValueCurrentRun() {

        if (this.runStats.totalBets === 0)
            return 0;

        return (
            this.runStats.totalBetValue /
            this.runStats.totalBets
        );

    }


    getFavoriteCombinationAllTime(){


        return this.getMostUsed(
            this.playerStats.combinationUsage
        );

    }





    getLuckiestCombinationAllTime(){


        return this.getMostUsed(
            this.playerStats.winningCombinationUsage
        );

    }




    getRunDuration(){


        return (
            Date.now() -
            this.runStats.startedAt
        );

    }


    getFormattedRunDuration() {

        const ms =
            (this.runStats.finishedAt ?? Date.now()) -
            this.runStats.startedAt;

        const totalSeconds =
            Math.floor(ms / 1000);

        const minutes =
            Math.floor(totalSeconds / 60);

        const seconds =
            totalSeconds % 60;

        return `${minutes}m ${seconds}s`;

    }

    getFormattedFastestRun(): string {

        if(this.playerStats.fastestRun === Number.MAX_SAFE_INTEGER){
            return "-";
        }

        const totalSeconds = Math.floor(this.playerStats.fastestRun / 1000);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}m ${seconds}s`;
    }



    getFormattedTotalPlayTime(): string {

        const totalSeconds =
            Math.floor(this.playerStats.totalPlayTime / 1000);

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor((totalSeconds % 3600) / 60);

        const seconds =
            totalSeconds % 60;

        if(hours > 0){
            return `${hours}h ${minutes}m ${seconds}s`;
        }

        if(minutes > 0){
            return `${minutes}m ${seconds}s`;
        }

        return `${seconds}s`;
    }





    // =========================
    // ADDICTION RANK
    // =========================


    getAddictionRank(){


        const hours =
            this.playerStats.totalPlayTime /
            1000 /
            60 /
            60;



        if(hours < 1)
            return "Curious Visitor";


        if(hours < 5)
            return "Coin Flipper";

        if(hours < 15)
            return "Lucky Beginner";

        if (hours < 35)
            return "Regular Gambler";

        if (hours < 75)
            return "High Roller";

        if (hours < 150)
            return "Casino Veteran";

        if (hours < 300)
            return "Coin Master";


        if(hours < 500)
            return "Casino Legend";


        return "Three Lucky Coins Myth";

    }





    // =========================
    // HELPERS
    // =========================


    private getMostUsed(
        data:Record<string,number>
    ):string|null{


        let result:string|null = null;

        let highest = 0;


        for(const key in data){


            if(data[key] > highest){


                highest = data[key];

                result = key;

            }

        }


        return result;

    }

    getCombinationUsageCurrentRun() {

        return Object.entries(
            this.runStats.combinationUsage
        )
        .sort((a, b) => b[1] - a[1]);

    }

    private formatBet(value: string | null): string | null {

        if (value === null) {
            return null;
        }

        return Number(value).toFixed(2);
    }

}