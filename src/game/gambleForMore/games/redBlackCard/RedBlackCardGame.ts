import { CardColor, RedBlackCardResult } from "./RedBlackCardTypes";

export class RedBlackCardGame {

    play(
        selectedColor:
            CardColor
    ): RedBlackCardResult {

        const resultColor =
            Math.random() < 0.5
                ? CardColor.RED
                : CardColor.BLACK;


        return {

            selectedColor,

            resultColor,

            won:
                selectedColor ===
                resultColor
        };
    }
}