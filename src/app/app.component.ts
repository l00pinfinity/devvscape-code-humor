import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TokenStorageService } from './core/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,public alertCtrl: AlertController) {
    this.platform.backButton.subscribeWithPriority(10,() => {
      this.exitConfirm();
    });

    this.initializeApp();
  }

 async initializeApp() {
    this.platform.ready().then(async () => {
      await SplashScreen.hide({
        fadeOutDuration:1000
      });
    })
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
}
