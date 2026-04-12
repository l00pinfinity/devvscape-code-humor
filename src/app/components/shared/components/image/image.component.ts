import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ImageService } from 'src/app/core/services/image.service';
import { Subscription } from 'rxjs';
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
  isLiked = false;
  isReplyActive = false;
  reportReasons: string[] = [
    'Inappropriate content',
    'Spam',
    'Harassment',
    'Violence',
    'Other',
  ];
  errorMessage: string = '';
  showError: boolean = false;

  constructor(
    private auth: Auth,
    private imageService: ImageService,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUser?.uid;
    this.checkLikeStatus();
  }

  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }

  private checkLikeStatus() {
    if (this.image?.likedBy && this.currentUser) {
      this.isLiked = this.image.likedBy.includes(this.currentUser);
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
    //// console.log removed for production
  }

  openImage(id: string): void {
    this.navCtrl.navigateForward(['image', id]);
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
    //// console.log removed for production
    this.isTextTruncated = !this.isTextTruncated;
  }

  generateAvatarUrl(name: string): string {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('');
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
            handler: async data => {
              if (data && data.reason) {
                const currentUserUid = this.currentUser;
                const imageId = image.id;
                const reason = data.reason;

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
      .then(alert => {
        alert.present();
      });
  }

  async likeImage(image: Image) {
    const user = this.auth.currentUser;

    if (user) {
      try {
        await this.imageService.likeImage(image.id, user.uid);
        this.isLiked = !this.isLiked;
        this.image.stars = this.isLiked
          ? (this.image.stars || 0) + 1
          : (this.image.stars || 0) - 1;
      } catch (error) {
        await this.presentErrorToast(`Error liking image: ${error}`);
      }
    }
  }

  toggleReply() {
    this.isReplyActive = !this.isReplyActive;
    if (this.isReplyActive) {
      this.openImage(this.image.id);
    }
  }

  async sharePost(image: Image) {
    if (navigator.share) {
      await navigator.share({ title: image.displayName, text: image.postText, url: window.location.href });
    }
  }

  private async presentErrorToast(message: string): Promise<void> {
    this.errorMessage = message;
    this.showError = true;
  }

  dismissError() {
    this.showError = false;
    this.errorMessage = '';
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
