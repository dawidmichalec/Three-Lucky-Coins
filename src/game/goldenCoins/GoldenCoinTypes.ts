import { CoinSide } from "../../ui/Coin";

export interface CoinOutcome {
    side: CoinSide;
    isGolden: boolean;
}

export interface GoldenCoinSettings {
    enabled: boolean;

    /*
        Bazowa szansa ulepszenia pojedynczej monety
        do wersji Golden.
    */
    baseChance: number;

    /*
        Mnożnik używany przez dealerów, perki i efekty.

        1 = normalna szansa
        0.5 = połowa szansy
        0 = całkowicie wyłączone
        2 = podwójna szansa
    */
    chanceMultiplier: number;

    /*
        Ograniczenie liczby złotych monet w jednym rzucie.
        Normalnie 3, ale dealer może ustawić np. 1.
    */
    maximumGoldenCoins: number;
}