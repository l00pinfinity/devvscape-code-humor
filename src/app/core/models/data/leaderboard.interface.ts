export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  points: number;
  gamesPlayed: number;
  updatedAt: any;
}
