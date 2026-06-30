import { CoinSide } from '../ui/Coin';

export const COMBINATIONS: CoinSide[][] = [
  [CoinSide.Heads, CoinSide.Heads, CoinSide.Heads],
  [CoinSide.Heads, CoinSide.Heads, CoinSide.Tails],
  [CoinSide.Heads, CoinSide.Tails, CoinSide.Tails],
  [CoinSide.Heads, CoinSide.Tails, CoinSide.Heads],
  [CoinSide.Tails, CoinSide.Tails, CoinSide.Tails],
  [CoinSide.Tails, CoinSide.Heads, CoinSide.Tails],
  [CoinSide.Tails, CoinSide.Tails, CoinSide.Heads],
  [CoinSide.Tails, CoinSide.Heads, CoinSide.Heads],
];