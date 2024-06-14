import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  backButtonSubscription: any;
  onlineStatusSubscription!: Subscription;

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
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

    this.checkOnlineStatus();
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
    this.onlineStatusSubscription.unsubscribe();
  }

  async loadSelectedLanguage() {
    const { value } = await Preferences.get({ key: 'selectedLanguage' });
    if (value) {
      this.translocoService.setActiveLang(value);
    }
  }

  async initializeApp() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(
        (result) => console.log('Has permission?', result.hasPermission),
        async () => {
          try {
            const hasPermission = await this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
            );
            if (!hasPermission.hasPermission) {
              const confirm = await this.alertCtrl.create({
                header: 'Permission Denied',
                message: 'Storage permission is required to upload images.',
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel',
                    handler: () => {},
                  },
                ],
              });
              await confirm.present();
            }
          } catch (error) {
            console.error('Error requesting permission:', error);
          }
        }
      );

      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
            // Example url: https://beerswift.app/tabs/tab2
            // slug = /tabs/tab2
            const slug = event.url.split(".app").pop();
            if (slug) {
                this.router.navigateByUrl(slug);
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    });
  }

  async exitConfirm() {
    const confirm = await this.alertCtrl.create({
      header: 'Code Escape Portal',
      message:
        'Ready to close the coding dimension and face reality? Choose your destiny.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Exit',
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