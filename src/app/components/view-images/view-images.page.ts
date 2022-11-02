import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Images } from 'src/app/core/interface/images';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.page.html',
  styleUrls: ['./view-images.page.scss'],
})
export class ViewImagesPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async like(image: Images) {
    console.log(image.id + " liked");
    const alert = await this.alertController.create({
      header: 'Liked',
      subHeader: 'This feature is not available yet',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'ok',
        }
      ]
    });

    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 1000);
  }

  async download(image: Images) {
    console.log(image.id + " downloaded");
    const alert = await this.alertController.create({
      header: 'Liked',
      subHeader: 'This feature is not available yet',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'ok',
        }
      ]
    });

    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 1000);
  }

}
