import { ButtonTheme } from "./ButtonTheme";


export interface ButtonStyle {
    fill: number;
    hoverFill: number;
    textColor: number;
}


export const BUTTON_STYLES: Record<ButtonTheme, ButtonStyle> = {

    [ButtonTheme.YELLOW]: {
        fill: 0xFFDE59,
        hoverFill: 0xCCA300,
        textColor: 0xffffff,
    },


    [ButtonTheme.BLUE]: {
        fill: 0x38B6FF,
        hoverFill: 0x004aad,
        textColor: 0xffffff,
    },


    [ButtonTheme.RED]: {
        fill: 0xff3131,
        hoverFill: 0xCC0000,
        textColor: 0xffffff,
    },


    [ButtonTheme.GREEN]: {
        fill: 0x4ca626,
        hoverFill: 0x2e6417,
        textColor: 0xffffff,
    },


    [ButtonTheme.MAGENTA]: {
        fill: 0xcb6ce6,
        hoverFill: 0x8f1eae,
        textColor: 0xffffff,
    },

    [ButtonTheme.BLACK]: {
        fill: 0x000000,
        hoverFill: 0x000000,
        textColor: 0xffffff,
    },

    [ButtonTheme.GREY]: {
        fill: 0xb4b4b4,
        hoverFill: 0xb4b4b4,
        textColor: 0xffffff,
    },

    [ButtonTheme.DARKGREEN]: {
        fill: 0x2e6417,
        hoverFill: 0x2e6417,
        textColor: 0xffffff,
    }


};