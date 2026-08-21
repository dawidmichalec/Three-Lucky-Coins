export interface CombinationModifiers {
  /*
        Dodawane do bazowego multipliera.

        Przykład:
        baseMultiplier = 1.3
        multiplierBonus = 0.5
        finalMultiplier = 1.8
    */
  multiplierBonus: number;

  /*
        Procentowa zmiana końcowej wygranej.

        0.15 = +15%
        -0.20 = -20%
    */
  winningsPercentModifier: number;

  /*
        Waga prawdopodobieństwa.

        1 = bez zmian
        1.25 = kombinacja o 25% częstsza
        0.75 = kombinacja o 25% rzadsza
        0 = kombinacja niemożliwa
    */
  probabilityWeight: number;

  blocked: boolean;
}

export function createDefaultCombinationModifiers(): CombinationModifiers {
  return {
    multiplierBonus: 0,
    winningsPercentModifier: 0,
    probabilityWeight: 1,
    blocked: false,
  };
}
