import { OddsTable } from "./OddsTypes";
import { DealerOddsProfile } from "./OddsTypes";


export class OddsManager {

    private static instance: OddsManager;

    private currentOdds!: OddsTable;

    static getInstance() {

        if (!OddsManager.instance) {
            OddsManager.instance = new OddsManager();
        }

        return OddsManager.instance;
    }

    private constructor(){}

    rollOdds(profile: DealerOddsProfile){

        this.currentOdds =
            OddsGenerator.generate(profile);

    }

    getOdds(){

        return this.currentOdds;

    }

}