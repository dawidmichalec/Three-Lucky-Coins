import { TranslationKey } from "../core/LocalizationManager";


export interface CreditLine {

    key?: TranslationKey;

    text?: string;

    size:number;

    bold?:boolean;

}


export const CREDITS_CONFIG: CreditLine[] = [

    {
        key:"createdBy",
        size:28
    },

    {
        text:"Dawid Michalec",
        size:40,
        bold:true
    },


    {
        text:"",
        size:28
    },


    {
        key:"gameDesign",
        size:28
    },

    {
        text:"Dawid Michalec",
        size:40,
        bold:true
    },


    {
        key:"coreGameplayMechanics",
        size:28
    },

    {
        key:"rogueliteProgressionSystem",
        size:28
    },

    {
        key:"balanceDesign",
        size:28
    },

    {
        key:"economyDesign",
        size:28
    },


    {
        text:"",
        size:28
    },


    {
        key:"programming",
        size:28
    },

    {
        text:"Dawid Michalec",
        size:40,
        bold:true
    },


    {
        key:"gameSystems",
        size:28
    },

    {
        key:"userInterface",
        size:28
    },

    {
        key:"animationSystems",
        size:28
    },

    {
        key:"toolsAndDeveloperFeatures",
        size:28
    },


    {
        text:"",
        size:28
    },


    {
        key:"artDirection",
        size:28
    },
    

    {
        text:"Dawid Michalec",
        size:40,
        bold:true
    },


    {
        key:"visualConcept",
        size:28
    },

    {
        key:"uiDesign",
        size:28
    },

    {
        key:"gameBranding",
        size:28
    },


    {
        text:"",
        size:28
    },


    {
        key:"soundDesignerAndComposer",
        size:28
    },

    {
        text:"Dawid Michalec",
        size:40,
        bold:true
    },


    {
        key:"originalSoundtrack",
        size:28
    },

    {
        key:"soundEffects",
        size:28
    },

    {
        key:"audioDirection",
        size:28
    },


    {
        text:"",
        size:28
    },


    {
        key:"specialThanksTo",
        size:40,
        bold:true
    },


    {
        text:"",
        size:28
    },


    {
        key:"playTesters",
        size:40,
        bold:true
    },

    {
        text:"Jan Kowalski",
        size:28
    },


    {
        text:"",
        size:28
    },


    {
        key:"myGirlfriend",
        size:40,
        bold:true
    },

    {
        key:"andEveryoneWhoSupportedMe",
        size:28
    },


    {
        text:"",
        size:28
    },


    {
        key:"thankYouForPlaying",
        size:40,
        bold:true
    },


    {
        text:"",
        size:40
    },


    {
        text:"Three Lucky Coins",
        size:16
    },

    {
        text:"Version 0.1.0",
        size:16
    },

    {
        text:"© 2026 Dawid Michalec",
        size:16
    }

];