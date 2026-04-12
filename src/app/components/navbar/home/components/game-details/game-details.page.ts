import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { AdMobService } from 'src/app/core/services/ad-mob.service';
import { LeaderboardService } from 'src/app/core/services/leaderboard.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
})
export class GameDetailsPage implements OnInit, OnDestroy {
  questions: any[] = [];
  shuffledAnswers: { [key: number]: string[] } = {};
  category!: number;
  amount!: number;
  difficulty!: string;
  type!: string;
  userAnswers: { [key: string]: string } = {};
  correctAnswers: number = 0;
  feedbacks: { [key: string]: string } = {};
  answeredQuestions: { [key: string]: boolean } = {};
  errorMessage: string = '';
  showError: boolean = false;
  allAnswered = false;
  submitted = false;
  private resultsAlert: HTMLIonAlertElement | null = null;

  private routeSub: Subscription = new Subscription();
  private backButtonSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private adMobService: AdMobService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private leaderboardService: LeaderboardService,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.category = params['category'];
      this.amount = params['amount'];
      this.difficulty = params['difficulty'];
      this.type = params['type'];
      this.fetchQuestions();
    });
  }

  ionViewWillEnter() {
    this.clearState();
    this.adMobService.hideBannerAd('home-banner-ad');
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, async () => {
      await this.confirmExit();
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
      this.backButtonSubscription = null;
    }
    this.adMobService.showBannerAd(
      'home-banner-ad',
      'ca-app-pub-6424707922606590/3709250809'
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  async fetchQuestions() {
    const loading = await this.loadingCtrl.create({ message: 'Loading questions...' });
    await loading.present();

    let url = `https://opentdb.com/api.php?amount=${this.amount}&category=${this.category}`;
    if (this.difficulty !== 'any') url += `&difficulty=${this.difficulty}`;
    if (this.type !== 'any') url += `&type=${this.type}`;

    try {
      const response: any = await this.http.get(url).toPromise();
      this.questions = response.results;
      this.shuffledAnswers = {};
      this.questions.forEach((q, i) => {
        const answers = [...q.incorrect_answers, q.correct_answer];
        for (let j = answers.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [answers[j], answers[k]] = [answers[k], answers[j]];
        }
        this.shuffledAnswers[i] = answers;
      });
      this.errorMessage = '';
      this.showError = false;
    } catch (error: any) {
      this.errorMessage = error?.message ? `Failed to load questions: ${error.message}` : 'Failed to load questions.';
      this.showError = true;
    } finally {
      loading.dismiss();
    }
  }

  async selectAnswer(questionIndex: number, answer: string) {
    if (this.answeredQuestions[questionIndex]) return;

    this.userAnswers[questionIndex] = answer;
    this.answeredQuestions[questionIndex] = true;

    if (answer === this.questions[questionIndex].correct_answer) {
      this.correctAnswers++;
      this.feedbacks[questionIndex] = 'Correct!';
    } else {
      this.feedbacks[questionIndex] = 'Incorrect!';
    }

    this.allAnswered = Object.keys(this.answeredQuestions).length === this.questions.length;
  }

  async showResults() {
    const points = this.correctAnswers * this.difficultyMultiplier();
    const pct = Math.round((this.correctAnswers / this.questions.length) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '😅';

    const alert = await this.alertCtrl.create({
      header: `${emoji} Results`,
      subHeader: `${this.correctAnswers}/${this.questions.length} correct — ${pct}%`,
      message: `+${points} points  (${this.difficulty} × ${this.difficultyMultiplier()}x)`,
      backdropDismiss: false,
      buttons: [
        { text: 'Discard', role: 'cancel' },
        {
          text: 'Submit to Leaderboard',
          handler: () => {
            // return false to keep alert open while async work runs
            this.submitScore(points);
            return false;
          },
        },
      ],
    });
    await alert.present();
    this.resultsAlert = alert;
  }

  async submitScore(points: number) {
    const user = this.auth.currentUser;
    if (this.resultsAlert) await this.resultsAlert.dismiss();

    if (!user) {
      const a = await this.alertCtrl.create({
        header: 'Not signed in',
        message: 'Sign in to save your score to the leaderboard.',
        buttons: ['OK'],
      });
      await a.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Saving score...' });
    await loading.present();
    try {
      await this.leaderboardService.addPoints(
        user.uid,
        user.displayName || 'devvscape_user',
        points
      );
      this.submitted = true;
    } finally {
      await loading.dismiss();
    }

    const done = await this.alertCtrl.create({
      header: '✅ Score Saved!',
      message: `+${points} points added to the leaderboard.`,
      buttons: [
        { text: 'View Leaderboard', handler: () => window.history.back() },
        { text: 'Done', role: 'cancel' },
      ],
    });
    await done.present();
  }

  async confirmExit(event?: Event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    if (!this.hasUnsavedChanges()) { window.history.back(); return; }
    const alert = await this.alertCtrl.create({
      header: 'Exit Game',
      message: 'Your progress will be lost. Exit anyway?',
      backdropDismiss: false,
      buttons: [
        { text: 'Stay', role: 'cancel' },
        { text: 'Exit', role: 'destructive', handler: () => window.history.back() },
      ],
    });
    await alert.present();
  }

  private difficultyMultiplier(): number {
    return this.difficulty === 'hard' ? 3 : this.difficulty === 'medium' ? 2 : 1;
  }

  private clearState() {
    this.userAnswers = {};
    this.correctAnswers = 0;
    this.feedbacks = {};
    this.answeredQuestions = {};
    this.shuffledAnswers = {};
    this.allAnswered = false;
    this.submitted = false;
    this.resultsAlert = null;
  }

  private hasUnsavedChanges(): boolean {
    return Object.keys(this.userAnswers).length > 0 && !this.submitted;
  }

  get answeredCount(): number {
    return Object.keys(this.answeredQuestions).length;
  }

  dismissError() {
    this.showError = false;
    this.errorMessage = '';
  }
}
