export type BetRule = 'all_same' | 'not_all_same';

export interface BetConfig {
  id: string;
  name: string;
  rule: BetRule;
  multiplier: number;
}

export interface BetsConfig {
  bets: BetConfig[];
}

export const BETS_CONFIG: BetsConfig = {
  bets: [
    {
      id: 'jackpot',
      name: 'Triple Match',
      rule: 'all_same',
      multiplier: 6.0,
    },
    {
      id: 'normal',
      name: 'Mixed Result',
      rule: 'not_all_same',
      multiplier: 1.3,
    },
  ],
};