import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,public alertCtrl: AlertController) {
    this.initializeApp();
    this.platform.backButton.subscribeWithPriority(10,() => {
      this.exitConfirm();
    })
  }

 async initializeApp() {
    this.platform.ready().then(async () => {
      await SplashScreen.hide({
        fadeOutDuration:200
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
