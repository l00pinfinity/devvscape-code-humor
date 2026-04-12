import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  limit,
} from '@angular/fire/firestore';
import { LeaderboardEntry, LeaderboardPeriod } from '../models/data/leaderboard.interface';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  constructor(private firestore: Firestore) {}

  async addPoints(uid: string, displayName: string, points: number): Promise<void> {
    const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly'];
    await Promise.all(
      periods.map(async period => {
        const ref = doc(this.firestore, `leaderboard/${period}/entries/${uid}`);
        const snap = await getDoc(ref);
        const existing = snap.exists() ? (snap.data() as LeaderboardEntry) : null;
        await setDoc(ref, {
          uid,
          displayName,
          points: (existing?.points ?? 0) + points,
          gamesPlayed: (existing?.gamesPlayed ?? 0) + 1,
          updatedAt: new Date(),
        });
      })
    );
  }

  async getLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardEntry[]> {
    const q = query(
      collection(this.firestore, `leaderboard/${period}/entries`),
      orderBy('points', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as LeaderboardEntry) }));
  }
}
