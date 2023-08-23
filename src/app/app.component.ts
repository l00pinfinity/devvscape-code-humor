import { Component, OnInit, OnDestroy } from '@angular/core';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  backButtonSubscription: any;
  onlineStatusSubscription: Subscription;

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private onlineStatusService: OnlineStatusService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    await SplashScreen.hide();
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.exitConfirm();
    });

    this.checkOnlineStatus();
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
    this.onlineStatusSubscription.unsubscribe();
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
