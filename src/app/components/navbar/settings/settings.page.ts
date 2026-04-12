import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { VersionService } from 'src/app/core/services/version.service';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentVersion!: string;
  appVersion = '2.0.4';
  languages = ['en', 'es', 'fr', 'de', 'sw', 'pt'];
  selectedLanguage = 'en';
  private loadingSubject = new Subject<boolean>();
  loading!: HTMLIonLoadingElement;
  presentingElement!: any;
  options: InAppBrowserOptions = {
    location: 'yes', //Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no', //iOS only
    presentationstyle: 'pagesheet', //iOS only
    fullscreen: 'yes', //Windows only
  };
  errorMessage: string = '';
  showError: boolean = false;
  darkMode: boolean = false;
  pushEnabled: boolean = true;
  soundEnabled: boolean = true;

  constructor(
    private authService: AuthService,
    private adMobService: AdMobService,
    private versionService: VersionService,
    private translocoService: TranslocoService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.loadSelectedLanguage();
    this.fetchCurrentVersion();
    this.loadThemeAndPrefs();
  }

  ionViewWillEnter() {
    this.adMobService.showBannerAd(
      'notification-banner-ad',
      'ca-app-pub-6424707922606590/1224657880'
    );
  }

  async fetchCurrentVersion() {
    try {
      this.currentVersion = await this.versionService.getCurrentVersion();
      this.checkForUpdate();
    } catch (error) {
      console.error('Error fetching current version:', error);
      // Handle error appropriately in your application
    }
  }

  async checkForUpdate() {
    if (this.currentVersion !== this.appVersion) {
      await this.presentUpdateAlert();
    } else {
    }
  }

  async presentUpdateAlert() {
    const header = this.translocoService.translate(
      'COMPONENTS.NAVBAR.SETTINGS.UPDATEHEADER'
    );
    const message = this.translocoService.translate(
      'COMPONENTS.NAVBAR.SETTINGS.UPDATEMESSAGE'
    );
    const later = this.translocoService.translate(
      'COMPONENTS.NAVBAR.SETTINGS.LATER'
    );
    const update = this.translocoService.translate(
      'COMPONENTS.NAVBAR.SETTINGS.UPDATE'
    );

    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: later,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Handle "Later" button action
          },
        },
        {
          text: update,
          handler: () => {
            // Redirect to Google Play Store for update
            window.open(
              'https://play.google.com/store/apps/details?id=com.silkwebhq.devvscapecode',
              '_system'
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    await Preferences.set({ key: 'lang', value: lang });
  }

  async loadSelectedLanguage() {
    const lang = await Preferences.get({ key: 'lang' });
    const selectedLang = lang.value || 'en';
    this.selectedLanguage = selectedLang;
    this.translocoService.setActiveLang(selectedLang);
  }

  async loadThemeAndPrefs() {
    const dark = await Preferences.get({ key: 'darkMode' });
    this.darkMode = dark.value === 'true';
    document.body.classList.toggle('dark', this.darkMode);

    const push = await Preferences.get({ key: 'pushEnabled' });
    this.pushEnabled = push.value !== 'false';

    const sound = await Preferences.get({ key: 'soundEnabled' });
    this.soundEnabled = sound.value !== 'false';
  }

  async savePushPref() {
    await Preferences.set({
      key: 'pushEnabled',
      value: String(this.pushEnabled),
    });
  }

  async saveSoundPref() {
    await Preferences.set({
      key: 'soundEnabled',
      value: String(this.soundEnabled),
    });
  }

  async clearCache() {
    await Preferences.remove({ key: 'gameSettings' });
    const toast = await this.toastCtrl.create({
      message: 'Cache cleared',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  disableAccount() {}

  async closeAccount() {
    const header = this.translocoService.translate(
      'COMPONENTS.NAVBAR.SETTINGS.DELETEHEADER'
    );
    const message = this.translocoService.translate(
      'COMPONENTS.NAVBAR.SETTINGS.DELETEMESSAGE'
    );
    const cancel = this.translocoService.translate('APP.CANCEL_BUTTON');
    const exit = this.translocoService.translate('APP.DELETE_BUTTON');

    const alert = await this.alertCtrl.create({
      header,
      message,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      ],
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: () => {},
        },
        {
          text: exit,
          role: 'exit',
          handler: async data => {
            if (data && data.password) {
              this.showLoading().subscribe({
                next: () => {
                  this.authService
                    .deleteAccount(data.password)
                    .pipe(finalize(() => this.hideLoading()))
                    .subscribe({
                      next: () => this.router.navigateByUrl('signup'),
                      error: error => {
                        if (error.code === 'auth/requires-recent-login') {
                          // Handle recent login requirement
                        } else {
                          // Handle account deletion error
                        }
                      },
                    });
                },
                error: error => {
                  // Handle loading error
                },
              });
            } else {
              // Password required for account deletion
            }
          },
        },
      ],
    });
    await alert.present();
  }

  openWithSystemBrowser(url: string) {
    const target = '_system';
    this.iab.create(url, target, this.options);
  }

  openWithInAppBrowser(url: string) {
    const target = '_blank';
    this.iab.create(url, target, this.options);
  }

  showLoading(): Observable<void> {
    return new Observable<void>(observer => {
      this.loadingCtrl
        .create({
          message: 'Closing account...',
          cssClass: 'custom-loading',
        })
        .then(loading => {
          this.loading = loading;
          this.loading.present().then(() => {
            this.loadingSubject.next(true);
            observer.next();
            observer.complete();
          });
        })
        .catch(error => {
          this.handleError(error);
          observer.error(error);
        });
    });
  }

  hideLoading(): void {
    if (this.loading) {
      this.loading.dismiss().then(() => this.loadingSubject.next(false));
    } else {
      this.loadingSubject.next(false);
    }
  }

  async handleError(error: any, customMessage?: string): Promise<void> {
    this.errorMessage = customMessage || error.message || 'An error occurred';
    this.showError = true;
  }

  dismissError() {
    this.showError = false;
    this.errorMessage = '';
  }
}
