import { Component, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TokenStorageService } from './core/services/token-storage.service';
import { Router } from '@angular/router';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private router: Router, private alertCtrl: AlertController, private tokenStorage: TokenStorageService, private onlineStatusService: OnlineStatusService, private toastCtrl: ToastController,private permissions: AndroidPermissions) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.exitConfirm();
    });

    this.initializeApp();
  }
  ngOnInit(): void {
    this.checkOnlineStatus();
    localStorage.setItem('devvscapeFirstAppLoad', 'yes');
    if (this.tokenStorage.getAccessToken()) {
      this.router.navigateByUrl('/home');
    }
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      // Show the splash for two seconds and then automatically hide it:
      await SplashScreen.hide();
    })

        // Check for storage permission
        const hasPermission = await this.permissions.checkPermission(this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
        if (!hasPermission) {
          try {
            const result = await this.permissions.requestPermission(this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
            if (!result.hasPermission) {
              // Permission denied
              const confirm = this.alertCtrl.create({
                header: 'Permission Denied',
                message: 'Storage permission denied',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      // Handle cancel button click
                    }
                  }]
              });
              (await confirm).present();
              return;
            }
          } catch (err) {
            // Handle error
            const confirm = this.alertCtrl.create({
              header: 'Error',
              message: err,
              buttons: [
                {
                  text: 'Ok',
                  role: 'cancel',
                  handler: () => {
                    // Handle cancel button click
                  }
                }]
            });
            (await confirm).present();
            return;
          }
        }
  }

  async exitConfirm() {
    const confirm = this.alertCtrl.create({
      header: 'Exit App',
      message: 'Do you  want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        },
        {
          text: 'Exit',
          role: 'exit',
          handler: () => {
            // console.log('Confirm Exit');
            navigator['app'].exitApp();
          }
        }]
    });
    (await confirm).present();
  }

  //checkOnlineStatus
  public checkOnlineStatus() {
    this.onlineStatusService.status.subscribe(async (status: OnlineStatusType) => {
      if (status === OnlineStatusType.OFFLINE) {
        const toast = this.toastCtrl.create({
          message: "You are offline. Please connect to the internet.",
          duration: 5000,
          position: 'bottom',
          color: 'danger',
          icon: 'wifi'
        });
        await (await toast).present();
        setTimeout(async () => {
          (await toast).dismiss();
        }, 3000);
      }
    })
  }
}
