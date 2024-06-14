import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Auth, updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { ImageService } from 'src/app/core/services/image.service';
import { collection, deleteDoc, doc, getFirestore } from '@angular/fire/firestore';
import { Image } from 'src/app/core/models/data/image.interface';
import { UserProfile } from 'src/app/core/models/data/user.interface';
import { Comment } from 'src/app/core/models/data/comment.interface.ts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnDestroy, OnInit {
  maxLength = 200;
  currentUser: any;
  selectedSegment: string = 'posts';
  images$!: Observable<Image[]>;
  comments: Comment[] = [];
  user: any;
  userPostsComments$!: Observable<Comment[]>;
  fullNames: string = '';
  imageLoaded: boolean = false;
  isTextTruncated: boolean = true;
  commentsSubscription!: Subscription;
  private userProfileSubscription!: Subscription;

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router,
    private profileService: ProfileService,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) { }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
    this.userProfileSubscription = this.profileService
      .getUserProfile()
      .subscribe((userProfile: UserProfile) => {
        this.fullNames = userProfile.fullName;
        this.fetchImages();
        this.fetchUserPostComments();
      });
  }

  ngOnDestroy(): void {
    if (this.commentsSubscription) {
      this.commentsSubscription.unsubscribe();
    }
    if (this.userProfileSubscription) {
      this.userProfileSubscription?.unsubscribe();
    }
  }

  refresh(ev: any) {
    this.fetchImages();
    this.fetchUserPostComments();
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  changeDP() { }

  openProfile(author: string) {
    console.log(`Opening profile of ${author}`);
  }

  generateAvatarUrl(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&format=svg`;
  }

  async updateDisplayName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'username', placeholder: 'Your new username' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: async (data) => {
            const newDisplayName = data.username;
            const user = this.auth.currentUser;
            if (user) {
              try {
                await updateProfile(user, { displayName: newDisplayName });
                const toast = await this.toastCtrl.create({
                  message: 'Display name updated successfully',
                  duration: 3000,
                  position: 'bottom',
                  color: 'success',
                });
                await toast.present();
                this.user.displayName = newDisplayName;
              } catch (error) {
                const toast = await this.toastCtrl.create({
                  message: 'Error updating display name',
                  duration: 3000,
                  position: 'bottom',
                  color: 'danger',
                });
                await toast.present();
                console.error('Error updating display name:', error);
              }
            }
          },
        },
      ],
    });
    return await alert.present();
  }

  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: async (data) => {
            const newEmail = data.newEmail;
            const password = data.password;
            const user = this.auth.currentUser;
            if (user && user.email) {
              const credential = EmailAuthProvider.credential(user.email, password);
              try {
                await reauthenticateWithCredential(user, credential);
                await updateEmail(user, newEmail);
                const toast = await this.toastCtrl.create({
                  message: 'Email updated successfully',
                  duration: 3000,
                  position: 'bottom',
                  color: 'success',
                });
                await toast.present();
                this.user.email = newEmail;
              } catch (error) {
                const toast = await this.toastCtrl.create({
                  message: 'Error updating email',
                  duration: 3000,
                  position: 'bottom',
                  color: 'danger',
                });
                await toast.present();
                console.error('Error updating email:', error);
              }
            }
          },
        },
      ],
    });
    return await alert.present();
  }

  openImage(id: string): void {
    this.router.navigate(['image', id]);
  }

  logOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error', error);
      }
    });
  }

  segmentChanged() { }

  async fetchImages() {
    if (this.selectedSegment === 'posts') {
      this.images$ = await this.imageService.getUserPosts();
    } else if (this.selectedSegment === 'comments') {
      this.fetchUserPostComments();
    }
  }

  async fetchUserPostComments() {
    this.userPostsComments$ = this.imageService.getUserPostsComments(this.currentUser?.uid);

    this.commentsSubscription = this.userPostsComments$.subscribe(
      (comments) => {
        this.comments = comments;
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  async commentAction(comment: Comment) {
    //console.log(comment);
    this.router.navigate(['image', comment.postId]);
  }

  async deleteComment(comment: Comment) {
    if (this.currentUser?.uid === comment.postedBy) {
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
                if (comment.postId && comment.id) {
                  await this.imageService.deleteComment(comment.postId, comment.id);

                  const toast = await this.toastCtrl.create({
                    message: 'Your comment has been deleted from the app repository!',
                    duration: 5000,
                    position: 'bottom',
                    color: 'danger',
                  });
                  await toast.present();

                  await this.fetchUserPostComments();
                } else {
                  await this.presentErrorToast('Error: Comment or post ID is missing.');
                }
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
      await this.presentErrorToast('You are not authorized to delete this comment.');
    }
  }

  async presentErrorToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

  async deleteImage(image: Image) {
    const confirm = this.alertCtrl.create({
      header: 'Delete',
      message: 'About to delete a post. 🤠 Ready to hit `delete` on that post?',
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
            const user = this.auth.currentUser;
            const userId = user?.uid;
            try {
              if (image.postedBy === userId) {
                const firestore = getFirestore();
                const postsCollection = collection(firestore, 'posts');
                const postRef = doc(postsCollection, image.id);

                await deleteDoc(postRef);
                this.fetchImages();

                const toast = this.toastCtrl.create({
                  message: 'Your post has been deleted from the app repository!',
                  duration: 5000,
                  position: 'bottom',
                  color: 'success',
                });
                (await toast).present();
              }
            } catch (error) {
              console.error('Error deleting post:', error);
              throw error;
            }
          },
        },
      ],
    });
    (await confirm).present();
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
    this.isTextTruncated = !this.isTextTruncated;
  }
}
