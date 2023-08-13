import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Http } from '@capacitor-community/http';
import { AlertController, ToastController } from '@ionic/angular';
import { Image } from 'src/app/core/interface/image';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() image: Image;
  imageLoaded = false;

  constructor(
    private auth: Auth,
    private imageService: ImageService,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) {}

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  openProfile(author: string) {
    //console.log(`Opening profile of ${author}`);
  }

  formatCardSubtitle(image: any): string {
    const displayName = image.displayName || 'devvscape_user';
    const formattedText = image.postText.replace(
      /#(\w+)/g,
      `<a class="hashtag" style="
        color: blue;
        text-decoration: none;
        cursor: pointer;
      ">#$1</a>`
    );

    return `<b>${displayName}</b> ${formattedText}`;
  }

  likeImage(image: Image) {
    const user = this.auth.currentUser; // You might need to make 'auth' public in your ImageService
    console.log(image.id);

    if (user) {
      // Call the likeImage method from ImageService
      this.imageService
        .likeImage(image.id, user.uid)
        .then(() => {
          // Handle any success logic here if needed
          console.log(`${image.id}` + 'has been liked by' + `${user.uid}`);
        })
        .catch((error) => {
          // Handle error here
          console.error('Error liking image:', error);
        });
    } else {
      // Handle the case when user is not authenticated
      console.warn('User is not authenticated.');
    }
  }

  async downloadImage(image: Image): Promise<void> {
    try {
      const imageUrl = image.imageUrl; // Use the provided image URL

      const fileName = `${image.id}.jpg`; // Set the desired file name

      await Http.downloadFile({
        url: imageUrl,
        filePath: `downloads/${fileName}`, // Save in a 'downloads' directory
      });

      const toast = this.toastCtrl.create({
        message: "Image downloaded successfully" + fileName,
        duration: 5000,
        position: 'bottom',
        color: 'success',
      });
      (await toast).present();
    } catch (error) {
      console.error('Error downloading image:', error);
      const toast = this.toastCtrl.create({
        message: "Error downloading image:" + error,
        duration: 5000,
        position: 'bottom',
        color: 'danger',
      });
      (await toast).present();
    }
  }

  bookmarkImage(image: Image) {
    console.log('Bookmarked');
  }

  reportImage(image: Image) {
    console.log('Reported');
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
