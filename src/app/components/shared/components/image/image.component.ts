import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Auth } from '@angular/fire/auth';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ImageService } from 'src/app/core/services/image.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Subscription } from 'rxjs';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Image } from 'src/app/core/models/data/image.interface';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit, OnDestroy {
  @Input() image!: Image;
  imageLoaded = false;
  maxLength = 200;
  isTextTruncated = true;
  currentUser: any;
  permissionSubscription!: Subscription;

  constructor(
    private auth: Auth,
    private imageService: ImageService,
    private router: Router,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUser?.uid;
  }

  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }

  async presentPermissionDeniedAlert() {
    const confirm = await this.alertCtrl.create({
      header: 'Permission Denied',
      message: 'Storage permission is required to perform this action.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    await confirm.present();
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  openProfile(author: string) {
    console.log(`Opening profile of ${author}`);
  }

  openImage(id: string): void {
    this.router.navigate(['image', id]);
  }

  formatCardSubtitle(image: any): string {
    const displayName = image.displayName || 'devvscape_user';

    let formattedText = image.postText;

    if (this.isTextTruncated && image.postText.length > this.maxLength) {
      formattedText = image.postText.substring(0, this.maxLength) + '...';
    }

    formattedText = formattedText.replace(
      /#(\w+)/g,
      `<a class="hashtag" style="
        color: blue;
        text-decoration: none;
        cursor: pointer;
      ">#$1</a>`
    );

    const formattedTextWithLineBreaks = formattedText.replace(/\\n/g, '<br>');

    return `<b>${displayName}</b> ${formattedTextWithLineBreaks}`;
  }

  toggleText(): void {
    //console.log('Working clicked');
    this.isTextTruncated = !this.isTextTruncated;
  }

  generateAvatarUrl(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff?format=svg`;
  }

  async imageDropdown(image: Image) {
    const alert = await this.alertCtrl.create({
      header: 'Options',
      subHeader: '',
      buttons: [
        {
          text: 'Report',
          role: 'danger',
          handler: () => {
            this.reportImage(image);
          },
        },
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }


  async reportImage(image: Image) {
    this.alertCtrl
      .create({
        header: 'Report Post',
        message: 'Please provide a reason for reporting this post',
        inputs: [
          {
            name: 'reason',
            type: 'text',
            placeholder: 'Reason...',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Report',
            role: 'danger',
            handler: async (data) => {
              if (data && data.reason) {
                const currentUserUid = this.currentUser;
                const imageId = image.id;
                const reason = data.reason;

                console.log(
                  'CurrentUid:' + currentUserUid,
                  'imageId' + imageId,
                  'reason' + reason
                );

                try {
                  await this.imageService.reportImage(
                    imageId,
                    currentUserUid,
                    reason
                  );
                  await this.presentSuccessToast(
                    'Report sent! Our team is now in `code review` mode.'
                  );
                } catch (error) {
                  await this.presentErrorToast(
                    `Error reporting image: ${error}`
                  );
                }
              } else {
                await this.presentErrorToast(
                  'Looks like you forgot to `commit` a brief description of the issue in the report.'
                );
              }
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  async likeImage(image: Image) {
    const user = this.auth.currentUser;

    if (user) {
      this.imageService
        .likeImage(image.id, user.uid)
        .then(() => {
          //console.log(`${image.id}` + 'has been liked by' + `${user.uid}`);
        })
        .catch(async (error) => {
          await this.presentErrorToast(`Error liking image: ${error.error}`);
        });
    } else {
      //console.warn('User is not authenticated.');
    }
  }

  private async presentErrorToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

  private async presentSuccessToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}