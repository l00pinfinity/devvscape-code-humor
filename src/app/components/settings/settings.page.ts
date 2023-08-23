import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { ProfileService } from 'src/app/core/services/profile.service';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentVersion: string;
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

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private version: VersionService,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    this.currentVersion = this.version.getCurrentVersion();
  }

  openWithSystemBrowser(url: string) {
    const target = '_system';
    this.iab.create(url, target, this.options);
  }

  openWithInAppBrowser(url: string) {
    const target = '_blank';
    this.iab.create(url, target, this.options);
  }

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
          handler: () => {},
        },
        {
          text: 'Delete',
          role: 'exit',
          handler: async (data) => {
            if (data && data.password) {
              const password = data.password;
              this.profileService.closeAccount(password).subscribe(
                async () => {
                  const toast = this.toastCtrl.create({
                    message:'Your account has been deleted',
                    duration: 5000,
                    position: 'bottom',
                    color: 'success',
                  });
                  (await toast).present();
                  this.router.navigateByUrl('signup');
                },
                async (error) => {
                  const toast = this.toastCtrl.create({
                    message: `${error}`,
                    duration: 5000,
                    position: 'bottom',
                    color: 'danger',
                  });
                  (await toast).present();
                }
              );
            }else{
              const toast = this.toastCtrl.create({
                message: 'You need to confirm account deletion by inputing your password',
                duration: 5000,
                position: 'bottom',
                color: 'danger',
              });
              (await toast).present();
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
