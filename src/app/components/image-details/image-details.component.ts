import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Http } from '@capacitor-community/http';
import { Platform, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Comment, Image } from 'src/app/core/interface/image.interface';
import { Auth } from '@angular/fire/auth';
import { ImageService } from 'src/app/core/services/image.service';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Notification } from 'src/app/core/interface/notification.interface';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.css'],
})
export class ImageDetailsComponent implements OnInit {
  image: any;
  errorMessage: string | null = null;
  maxLength = 200;
  commentText = '';
  isTextTruncated = true;
  imageLoaded = false;
  currentUser: any;
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentUser = this.auth.currentUser.uid;
    this.loadImageDetails();
  }

  refresh(ev) {
    setTimeout(() => {
      this.loadImageDetails();
      ev.detail.complete();
    }, 3000);
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

  formatCommentCard(comment: any): string {
    return this.formatCommentCardSubtitle({ comment });
  }

  formatCommentCardSubtitle(image: any): string {
    // Check if image and image.comment are defined
    if (!image || !image.comment) {
      return ''; // or some default value
    }

    let formattedText = image.comment.text || '';

    formattedText = formattedText.replace(
      /#(\w+)/g,
      `<a class="hashtag" style="
        color: blue;
        text-decoration: none;
        cursor: pointer;
      ">#$1</a>`
    );

    const formattedTextWithLineBreaks = formattedText.replace(/\\n/g, '<br>');

    return `${formattedTextWithLineBreaks}`;
  }

  async getUserFullName(uid: string): Promise<string> {
    try {
      const userCollection = collection(this.firestore, 'users');
      const userQuery = query(userCollection, where('uid', '==', uid));
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.fullName) {
          return userData.fullName;
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    return 'devvscape_user';
  }

  async getImageComments() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const comments = await this.imageService.getImageComments(id);
        this.image.comments = comments;
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Error fetching post comments',
          duration: 5000,
          position: 'bottom',
          color: 'danger',
        });
        await toast.present();
      }
    } else {
      this.errorMessage = 'ID not provided';
    }
  }

  async deleteComment(comment: Comment) {
    if (this.currentUser === comment.postedBy) {
      const confirm = await this.alertCtrl.create({
        header: 'Delete',
        message: 'Are you sure you want to delete this comment?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { },
          },
          {
            text: 'Delete',
            role: 'exit',
            handler: async () => {
              try {
                const imageId = this.image.id;
                const commentId = comment.id;

                await this.imageService.deleteComment(imageId, commentId);

                const toast = await this.toastCtrl.create({
                  message: 'Your comment has been deleted from the app repository!',
                  duration: 5000,
                  position: 'bottom',
                  color: 'danger',
                });
                await toast.present();

                await this.loadImageDetails();
              } catch (error) {
                console.error('Error deleting comment:', error);
                await this.presentErrorToast('Error deleting comment');
              }
            },
          },
        ],
      });
      await confirm.present();
    } else {

    }
  }

  async imagePostComment(image: Image) {
    const user = this.auth.currentUser;

    if (this.commentText !== '') {
      this.showLoading();

      try {
        await this.imageService.addComment(image.id, user.uid, user.displayName, this.commentText.replace(/\n/g, '\\n'));

        const isCommentedByOwner = user.uid === image.postedBy;

        let notificationMessage = isCommentedByOwner
          ? 'You added a comment on your post'
          : `${user.displayName} commented on your post`;

        const notification: Notification = {
          title: 'New Comment',
          body: notificationMessage,
          isRead: false,
          createdAt: new Date(),
          type: 'comment',
          imageId: image.id,
        };

        await this.notificationService.addNotification(image.postedBy, notification);

        this.hideLoading();

        const toast = await this.toastCtrl.create({
          message: 'Your comment has been committed to the app repository!',
          duration: 5000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();

        this.commentText = '';
        this.loadImageDetails();
      } catch (error) {

        this.hideLoading();

        const errorToast = await this.toastCtrl.create({
          message: 'An error occurred while saving your comment. Please try again.',
          duration: 5000,
          position: 'bottom',
          color: 'danger',
        });
        await errorToast.present();
      }
    } else {

    }
  }

  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Commenting...',
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

  toggleText(): void {
    this.isTextTruncated = !this.isTextTruncated;
  }

  async downloadImage(image: Image): Promise<void> {
    console.log(image);
    const permissionResult = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
    );

    if (!permissionResult.hasPermission) {
      const hasPermission = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      );

      if (!hasPermission.hasPermission) {
        const confirm = await this.alertCtrl.create({
          header: 'Permission Denied',
          message: 'Time to unleash the memes! Storage access needed for some pixel partying',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => { },
            },
          ],
        });
        await confirm.present();
        return;
      }
    }
    const imageUrl = image.imageUrl;
    const fileName = `${image.id}.jpg`;

    if (this.platform.is('android')) {
    } else if (this.platform.is('ios')) {
    } else {
      throw new Error('Unsupported platform');
    }

    Http.downloadFile({
      url: imageUrl,
      filePath: fileName,
    })
      .then(async (data) => {
        await this.presentSuccessToast(
          `Image downloaded successfully: ${data.path}`
        );
        await this.imageService.downloads(image.id, this.currentUser);
      })
      .catch(async (error) => {
        await this.presentErrorToast(`Error downloading image: ${error.error}`);
      });
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

  private async loadImageDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.imageService.getImagePostById(id)
        .then((image) => {
          if (image) {
            this.getImageComments();
            this.image = image;
          } else {
            this.errorMessage = 'Something wrong happen while loading the post';
            this.router.navigateByUrl('images')
          }
        })
        .catch((error) => {
          this.errorMessage = 'Unable to fetch image post by ID';
          console.error(error);
        });
    } else {
      this.errorMessage = 'ID not provided';
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

  private async reportImage(image: Image) {
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
}

