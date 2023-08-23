import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { ImageService } from 'src/app/core/services/image.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentVersion: string;
  currentUser: any;
  loading: HTMLIonLoadingElement;
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
    private auth: Auth,
    private profileService: ProfileService,
    private imageService: ImageService,
    private router: Router,
    private version: VersionService,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    this.currentVersion = this.version.getCurrentVersion();
    this.currentUser = this.auth.currentUser.uid;
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
      message:
        'About to close account? Enter your password to confirm account deletion:',
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
            try {
              await this.showLoading();

              if (data && data.password) {
                const password = data.password;

                try {
                  const postsDeleted = await this.imageService.deleteUserPosts(
                    this.currentUser
                  );
                  if (postsDeleted) {
                    try {
                      await this.profileService
                        .closeAccount(password)
                        .toPromise();

                      const toast = await this.toastCtrl.create({
                        message:
                          '🚀 Your account and posts have been successfully deleted',
                        duration: 5000,
                        position: 'bottom',
                        color: 'success',
                      });
                      await toast.present();
                    } catch (error) {
                      await this.handleError(error);
                    }
                  } else {
                    // Handle the case where no posts were found for deletion
                  }
                } catch (error) {
                  console.error('Error deleting posts:', error);
                }
              } else {
                await this.handleError(
                  'You need to confirm account deletion by inputting your password'
                );
              }
            } catch (error) {
              console.error(error);
            } finally {
              await this.hideLoading();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Closing account...',
        cssClass: 'custom-loading',
      });
      await this.loading.present();
    } catch (error) {
      this.handleError(error);
    }
  }

  async hideLoading(): Promise<boolean> {
    if (this.loading) {
      return this.loading.dismiss();
    }
    return false;
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
