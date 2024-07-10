import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AdMob } from '@capacitor-community/admob';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { TranslocoService } from '@jsverse/transloco';
import { register } from 'swiper/element/bundle';
import { AdMobService } from './core/services/ad-mob.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  backButtonSubscription: any;
  onlineStatusSubscription!: Subscription;
  routerSubscription!: Subscription;

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private adMobService: AdMobService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private onlineStatusService: OnlineStatusService,
    private router: Router,
    private zone: NgZone,
    private translocoService: TranslocoService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.loadSelectedLanguage();
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.exitConfirm();
    });

    this.lockScreenOrientation();
    this.checkOnlineStatus();
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
    this.onlineStatusSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  async loadSelectedLanguage() {
    const { value } = await Preferences.get({ key: 'selectedLanguage' });
    if (value) {
      this.translocoService.setActiveLang(value);
    }
  }

  async initializeApp() {
    try {
      const result = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
      if (!result.hasPermission) {
        const requestResult = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
        if (!requestResult.hasPermission) {
          await this.showPermissionDeniedAlert();
        }
      }
    } catch (error) {
      console.error('Error checking or requesting permission:', error);
    }
    
    this.platform.ready().then(() => {
      AdMob.initialize({
        initializeForTesting: false,
      });

      AdMob.setApplicationMuted({
        muted: true,
      });

      AdMob.setApplicationVolume({
        volume: 0.5,
      });
    });

    // Add other initialization logic here
    // Example: Add listener for appUrlOpen
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        // Example url: https://devvscape.com/tabs/tab2
        // slug = /tabs/tab2
        const slug = event.url.split(".com").pop();
        if (slug) {
          this.router.navigateByUrl(slug);
        }
      });
    });
  }

  async lockScreenOrientation() {
    await ScreenOrientation.lock({ orientation: 'portrait' });
  }

  async showPermissionDeniedAlert() {
    const confirm = await this.alertCtrl.create({
      header: 'Permission Denied',
      message: 'Storage permission is required to upload images.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => { },
        },
      ],
    });
    await confirm.present();
  }

  async exitConfirm() {
    const header = this.translocoService.translate('APP.ALERT_HEADER');
    const message = this.translocoService.translate('APP.ALERT_MESSAGE');
    const cancel = this.translocoService.translate('APP.CANCEL_BUTTON');
    const exit = this.translocoService.translate('APP.EXIT_BUTTON');

    const confirm = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: () => { },
        },
        {
          text: exit,
          role: 'exit',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });
    await confirm.present();
  }

  checkOnlineStatus() {
    this.onlineStatusSubscription = this.onlineStatusService.status.subscribe(
      async (status: OnlineStatusType) => {
        if (status === OnlineStatusType.OFFLINE) {
          const toast = await this.toastCtrl.create({
            message: 'Looks like you are in the land of offline adventures!',
            duration: 5000,
            position: 'bottom',
            color: 'danger',
          });
          await toast.present();
          setTimeout(async () => {
            await toast.dismiss();
          }, 3000);
        }
      }
    );
  }
}
