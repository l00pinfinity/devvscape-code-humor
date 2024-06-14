import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetController, AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentVersion = '2.0.1';
  languages = ['en', 'es'];
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


  constructor(private authService: AuthService, private translocoService: TranslocoService, private router: Router, private navCtrl: NavController, private alertCtrl: AlertController, public toastCtrl: ToastController, private loadingCtrl: LoadingController, private iab: InAppBrowser, private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.loadSelectedLanguage()
  }

  goToNotificationsPage() {
    this.navCtrl.navigateForward('/tabs/settings/notifications');
  }

  goToVisualsPage() {
    this.navCtrl.navigateForward('/tabs/settings/visuals');
  }

  async changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    this.selectedLanguage = lang;

    await Preferences.set({
      key: 'selectedLanguage',
      value: lang,
    });
  }

  async loadSelectedLanguage() {
    const { value } = await Preferences.get({ key: 'selectedLanguage' });
    if (value) {
      this.selectedLanguage = value;
      this.translocoService.setActiveLang(value);
    }
  }

  disableAccount(){}

  async closeAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Delete account',
      message: 'About to close account? Enter your password to confirm account deletion:',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: 'Delete',
          role: 'exit',
          handler: async (data) => {
            if (data && data.password) {
              console.log(data.password)
              this.showLoading().subscribe({
                next: () => {
                  this.authService.deleteAccount(data.password).pipe(
                    finalize(() => this.hideLoading())
                  ).subscribe({
                    next: () => this.router.navigateByUrl('signup'),
                    error: (error) => {
                      if (error.code === 'auth/requires-recent-login') {
                        console.log('Deleting your account requires you to have logged in recently. Please log in and try again.');
                      } else {
                        console.log('Error deleting account: ' + error.message);
                      }
                    }
                  });
                },
                error: (error) => {
                  console.log('Error showing loading: ' + error.message);
                }
              });
            } else {
              console.log('You need to confirm account deletion by inputting your password');
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
      this.loadingCtrl.create({
        message: 'Closing account...',
        cssClass: 'custom-loading',
      }).then(loading => {
        this.loading = loading;
        this.loading.present().then(() => {
          this.loadingSubject.next(true);
          observer.next();
          observer.complete();
        });
      }).catch(error => {
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
    const errorMessage = customMessage || error.message || 'An error occurred';
    const toast = await this.toastCtrl.create({
      message: errorMessage,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

}
