import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
})
export class GameDetailsPage implements OnInit, OnDestroy {
  questions: any[] = [];
  category!: number;
  amount!: number;
  difficulty!: string;
  type!: string;
  userAnswers: { [key: string]: string } = {};
  correctAnswers: number = 0;
  feedbacks: { [key: string]: string } = {};
  answeredQuestions: { [key: string]: boolean } = {};

  private routeSub: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private adMobService: AdMobService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

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
  }

  ionViewWillLeave() {
    this.adMobService.showBannerAd('home-banner-ad','ca-app-pub-6424707922606590/3709250809');
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  async fetchQuestions() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading questions...',
    });
    await loading.present();

    let url = `https://opentdb.com/api.php?amount=${this.amount}&category=${this.category}`;

    if (this.difficulty !== 'any') {
      url += `&difficulty=${this.difficulty}`;
    }

    if (this.type !== 'any') {
      url += `&type=${this.type}`;
    }

    try {
      const response: any = await this.http.get(url).toPromise();
      this.questions = response.results;
    } catch (error) {
      this.presentErrorAlert(error);
    } finally {
      loading.dismiss();
    }
  }

  async selectAnswer(questionIndex: number, answer: string) {
    if (this.answeredQuestions[questionIndex]) {
      return;
    }

    this.userAnswers[questionIndex] = answer;
    this.answeredQuestions[questionIndex] = true;

    if (answer === this.questions[questionIndex].correct_answer) {
      this.correctAnswers++;
      this.feedbacks[questionIndex] = 'Correct!';
    } else {
      this.feedbacks[questionIndex] = 'Incorrect!';
    }
  }

  private clearState() {
    this.userAnswers = {};
    this.correctAnswers = 0;
    this.feedbacks = {};
    this.answeredQuestions = {};
  }

  private hasUnsavedChanges(): boolean {
    return Object.keys(this.userAnswers).length > 0;
  }

  async presentErrorAlert(error: any) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: `Failed to load questions: ${error.message}`,
      buttons: ['OK']
    });
    await alert.present();
  }
}
