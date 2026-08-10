export enum CardColor {
    RED = "red",
    BLACK = "black"
}

export interface RedBlackCardResult {

    selectedColor:
        CardColor;

    resultColor:
        CardColor;

    won:
        boolean;
}
