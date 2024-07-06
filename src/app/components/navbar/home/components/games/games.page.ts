import { Component, OnInit, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;
  general = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.GENERAL');
  books = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.BOOKS');
  film = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.FILM');
  music = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.MUSIC');
  musical = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.MUSICAL');
  television = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.TELEVISION');
  videogames = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.VIDEOGAMES');
  boardgames = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.BOARDGAMES');
  nature = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.NATURE');
  computers = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.COMPUTERS');
  mathematics = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.MATHEMATICS');
  mythology = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.MYTHOLOGY');
  sports = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.SPORTS');
  geography = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.GEOGRAPHY');
  history = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.HISTORY');
  politics = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.POLITICS');
  art = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.ART');
  celebrities = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.CELEBRITIES');
  animals = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.ANIMALS');
  vehicles = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.VEHICLES');
  comics = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.COMICS');
  gadgets = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.GADGETS');
  japaneseanime = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.JAPANESEANIME');
  cartoon = this.translocoService.translate('COMPONENTS.NAVBAR.SETTINGS.GAMES.CARTOON');

  categories = [
    { id: 9, name: this.general },
    { id: 10, name: this.books },
    { id: 11, name: this.film },
    { id: 12, name: this.music },
    { id: 13, name: this.musical },
    { id: 14, name: this.television },
    { id: 15, name: this.videogames },
    { id: 16, name: this.boardgames },
    { id: 17, name: this.nature },
    { id: 18, name: this.computers },
    { id: 19, name: this.mathematics },
    { id: 20, name: this.mythology },
    { id: 21, name: this.sports },
    { id: 22, name: this.geography },
    { id: 23, name: this.history },
    { id: 24, name: this.politics },
    { id: 25, name: this.art },
    { id: 26, name: this.celebrities },
    { id: 27, name: this.animals },
    { id: 28, name: this.vehicles },
    { id: 29, name: this.comics },
    { id: 30, name: this.gadgets },
    { id: 31, name: this.japaneseanime },
    { id: 32, name: this.cartoon },
  ];

  defaultSettings = {
    amount: 10,
    difficulty: 'any',
    type: 'any'
  };

  constructor(private navCtrl: NavController, private translocoService: TranslocoService, private adMobService: AdMobService, private alertCtrl: AlertController) { }

  ngOnInit(): void {
    this.shuffleCategories();
    this.loadPreferences();
  }

  ionViewWillEnter() {
    this.adMobService.showBannerAd('game-banner-ad', 'ca-app-pub-6424707922606590/4972331204');
  }

  private shuffleCategories() {
    // Fisher-Yates shuffle algorithm
    for (let i = this.categories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.categories[i], this.categories[j]] = [this.categories[j], this.categories[i]];
    }
  }

  selectCategory(category: any) {
    this.navCtrl.navigateForward(['/tabs/home/game-details'], {
      queryParams: {
        category: category.id,
        amount: this.defaultSettings.amount,
        difficulty: this.defaultSettings.difficulty,
        type: this.defaultSettings.type
      }
    });
  }

  async confirm() {
    await this.savePreferences(this.defaultSettings);
    this.modal.dismiss();
  }

  private async loadPreferences() {
    try {
      const preferences = await Preferences.get({ key: 'gameSettings' });
      if (preferences.value) {
        this.defaultSettings = JSON.parse(preferences.value);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }

  private async savePreferences(settings: any) {
    try {
      await Preferences.set({
        key: 'gameSettings',
        value: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  onWillDismiss(event: Event) {

  }



}
