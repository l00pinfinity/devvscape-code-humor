import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { LeaderboardEntry, LeaderboardPeriod } from 'src/app/core/models/data/leaderboard.interface';
import { LeaderboardService } from 'src/app/core/services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  period: LeaderboardPeriod = 'daily';
  entries: LeaderboardEntry[] = [];
  currentUid: string | null = null;
  loading = false;

  constructor(private leaderboardService: LeaderboardService, private auth: Auth) {}

  ngOnInit() {
    this.currentUid = this.auth.currentUser?.uid ?? null;
    this.load();
  }

  async load() {
    this.loading = true;
    this.entries = await this.leaderboardService.getLeaderboard(this.period);
    this.loading = false;
  }

  onPeriodChange() {
    this.load();
  }

  rankBadge(i: number): string {
    return ['🥇', '🥈', '🥉'][i] ?? `${i + 1}`;
  }

  generateAvatarUrl(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&format=svg`;
  }
}
