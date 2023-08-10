import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Image } from 'src/app/core/interface/image';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() image: Image;
  imageLoaded = false;

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  openProfile(author: string) {
    //console.log(`Opening profile of ${author}`);
  }

  starImage(image: Image) {
    image.isStarred = !image.isStarred;
  }

  async imageDropdown(image: Image) {
    const alert = await this.alertCtrl.create({
      header: 'Options',
      subHeader: '',
      buttons: [
        {
          text: 'Report',
          role: 'danger',
          handler: () => {},
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}
