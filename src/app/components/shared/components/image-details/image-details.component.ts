import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Http } from '@capacitor-community/http';
import {
  Platform,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { ImageService } from 'src/app/core/services/image.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Image } from 'src/app/core/models/data/image.interface';
import { Comment } from 'src/app/core/models/data/comment.interface.ts';
import { Notification } from 'src/app/core/models/data/notification.interface';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent implements OnInit {
  image: any;
  errorMessage: string = '';
  maxLength = 200;
  commentText = '';
  isTextTruncated = true;
  imageLoaded = false;
  currentUser: any;
  loading!: HTMLIonLoadingElement;
  replyingTo: Comment | null = null;
  showError: boolean = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private imageService: ImageService,
    private adMobService: AdMobService,
    private notificationService: NotificationService,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUser;
    this.loadImageDetails();
  }

  ionViewWillEnter() {
    this.adMobService.hideBannerAd('home-banner-ad');
  }

  ionViewWillLeave() {
    this.adMobService.showBannerAd(
      'home-banner-ad',
      'ca-app-pub-6424707922606590/3709250809'
    );
  }

  refresh(ev: any) {
    setTimeout(() => {
      this.loadImageDetails();
      ev.detail.complete();
    }, 3000);
  }

  openProfile(author: string) {
    // Profile opening functionality
  }

  generateAvatarUrl(name: string): string {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff?format=svg`;
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
    if (!image || !image.comment) {
      return '';
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

  async getImageComments() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const comments = await this.imageService.getImageComments(id);
        //console.log("Comments", comments)
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
    if (this.currentUser.uid === comment.postedBy) {
      const confirm = await this.alertCtrl.create({
        header: 'Delete',
        message: 'Are you sure you want to delete this comment?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'Delete',
            role: 'exit',
            handler: async () => {
              try {
                const imageId = this.image.id;
                const commentId = comment.id;
                if (commentId) {
                  await this.imageService.deleteComment(imageId, commentId);

                  const toast = await this.toastCtrl.create({
                    message:
                      'Your comment has been deleted from the app repository!',
                    duration: 5000,
                    position: 'bottom',
                    color: 'danger',
                  });
                  await toast.present();
                }

                this.loadImageDetails();
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

  async likeComment(comment: Comment) {
    if (!this.currentUser) return;

    try {
      const userIndex = comment.likedBy.indexOf(this.currentUser.uid);
      if (userIndex === -1) {
        // Like the comment
        comment.likedBy.push(this.currentUser.uid);
        comment.stars += 1;
      } else {
        // Unlike the comment
        comment.likedBy.splice(userIndex, 1);
        comment.stars -= 1;
      }

      // Update the comment in the database
      await this.imageService.updateComment(
        this.image.id,
        comment.id!,
        comment
      );

      // Create notification for comment owner
      if (comment.postedBy !== this.currentUser.uid) {
        const notification: Notification = {
          title: 'New Like',
          body: `${this.currentUser.displayName} liked your comment`,
          isRead: false,
          createdAt: new Date(),
          type: 'like',
          imageId: this.image.id,
        };
        await this.notificationService.addNotification(
          comment.postedBy,
          notification
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      await this.presentErrorToast('Error liking comment');
    }
  }

  startReply(comment: Comment) {
    this.replyingTo = comment;
    this.commentText = `@${comment.displayName} `;
  }

  cancelReply() {
    this.replyingTo = null;
    this.commentText = '';
  }

  async imagePostComment(image: Image) {
    const user = this.auth.currentUser;

    if (this.commentText !== '') {
      this.showLoading();

      try {
        if (user) {
          const commentData = {
            text: this.commentText.replace(/\n/g, '\\n'),
            parentCommentId: this.replyingTo?.id,
          };

          await this.imageService.addComment(
            image.id,
            user.uid,
            user.displayName || 'devvscape_user',
            commentData.text,
            commentData.parentCommentId
          );

          const isCommentedByOwner = user.uid === image.postedBy;
          const notificationMessage = this.replyingTo
            ? `${user.displayName} replied to your comment`
            : isCommentedByOwner
            ? 'You added a comment on your post'
            : `${user.displayName} commented on your post`;

          const notification: Notification = {
            title: this.replyingTo ? 'New Reply' : 'New Comment',
            body: notificationMessage,
            isRead: false,
            createdAt: new Date(),
            type: 'comment',
            imageId: image.id,
          };

          // Send notification to post owner or comment owner if replying
          const notificationRecipient = this.replyingTo
            ? this.replyingTo.postedBy
            : image.postedBy;
          await this.notificationService.addNotification(
            notificationRecipient,
            notification
          );
        }

        const toast = await this.toastCtrl.create({
          message: 'Your comment has been committed to the app repository!',
          duration: 5000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();

        this.hideLoading();
        this.commentText = '';
        this.replyingTo = null;
        this.loadImageDetails();
      } catch (error) {
        console.error('Error while posting comment:', error);
        const errorToast = await this.toastCtrl.create({
          message:
            'An error occurred while saving your comment. Please try again.',
          duration: 5000,
          position: 'bottom',
          color: 'danger',
        });
        await errorToast.present();
        this.hideLoading();
      }
    } else {
      // Comment text is empty
      this.hideLoading();
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
      try {
        await this.loading.dismiss();
        return true;
      } catch (error) {
        console.error('Error hiding loading:', error);
        return false;
      }
    }
    return false;
  }

  async handleError(error: any, customMessage?: string): Promise<void> {
    this.errorMessage = customMessage || error.message || 'An error occurred';
    this.showError = true;
  }

  dismissError() {
    this.showError = false;
    this.errorMessage = '';
  }

  toggleText(): void {
    this.isTextTruncated = !this.isTextTruncated;
  }

  onCommentChange(): void {
    // Trim the comment text to remove leading/trailing whitespace
    this.commentText = this.commentText.trim();

    // If the comment text is longer than maxLength, truncate it
    if (this.commentText.length > this.maxLength) {
      this.commentText = this.commentText.substring(0, this.maxLength);
    }
  }

  async downloadImage(image: Image): Promise<void> {
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
          message:
            'Time to unleash the memes! Storage access needed for some pixel partying',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {},
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
      .then(async data => {
        await this.presentSuccessToast(
          `Image downloaded successfully: ${data.path}`
        );
        await this.imageService.downloads(image.id, this.currentUser.uid);
      })
      .catch(async error => {
        await this.presentErrorToast(`Error downloading image: ${error.error}`);
      });
  }

  async imageDropdown(image: Image) {
    const alert = this.alertCtrl.create({
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

    (await alert).present();
  }

  loadImageDetails() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'The post is not available.';
      this.presentErrorToast(this.errorMessage);
      this.router.navigate(['tabs/home']);
      return;
    }

    this.imageService.getImagePostById(id).subscribe(
      image => {
        if (image) {
          this.getImageComments();
          this.image = image;
        } else {
          this.errorMessage = 'The post is not available.';
          this.presentErrorToast(this.errorMessage);
          this.router.navigate(['tabs/home']);
        }
      },
      error => {
        console.error('Error loading image details:', error);
        this.errorMessage = 'An error occurred while loading the post details.';
        this.presentErrorToast(this.errorMessage);
        this.router.navigate(['tabs/home']);
      }
    );
  }

  private async presentErrorToast(message: string): Promise<void> {
    this.errorMessage = message;
    this.showError = true;
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
            handler: async data => {
              if (data && data.reason) {
                const currentUserUid = this.currentUser.uid;
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

  isCommentLiked(comment: Comment): boolean {
    return this.currentUser && comment.likedBy.includes(this.currentUser.uid);
  }

  isPostLiked(): boolean {
    return this.currentUser && this.image?.likedBy?.includes(this.currentUser.uid);
  }

  async likePost() {
    if (!this.currentUser || !this.image) return;
    try {
      await this.imageService.likeImage(this.image.id, this.currentUser.uid);
      const idx = this.image.likedBy.indexOf(this.currentUser.uid);
      if (idx === -1) {
        this.image.likedBy.push(this.currentUser.uid);
        this.image.stars = (this.image.stars || 0) + 1;
      } else {
        this.image.likedBy.splice(idx, 1);
        this.image.stars = (this.image.stars || 0) - 1;
      }
    } catch (error) {
      await this.presentErrorToast('Error liking post');
    }
  }

  async sharePost() {
    if (navigator.share) {
      await navigator.share({ title: this.image?.displayName, text: this.image?.postText, url: window.location.href });
    }
  }
}
