import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserProfile } from 'src/app/core/interface/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ProfileStore } from './profile.store';
import { Auth, updateProfile } from '@angular/fire/auth';
import { ImageService } from 'src/app/core/services/image.service';
import { Image } from 'src/app/core/interface/image.interface';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnDestroy, OnInit {
  maxLength = 200;
  isTextTruncated = true;
  fullNames: string;
  currentUser: any;
  public userProfile$: Observable<UserProfile> = this.profileStore.userProfile$;
  private userProfileSubscription: Subscription;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  images: any[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  selectedSegment = 'posts';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  imageLoaded = false;
  comments: any[];

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router,
    private navCtrl: NavController,
    private profileService: ProfileService,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private readonly profileStore: ProfileStore
  ) { }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser.uid;
    this.userProfileSubscription = this.profileService
      .getUserProfile()
      .subscribe((userProfile: UserProfile) => {
        this.profileStore.setState(userProfile);
        this.fullNames = userProfile.fullName;
        this.fetchImages();
      });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
  }

  refresh(ev) {
    this.fetchImages();
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  async openSettings() {
    this.navCtrl.navigateForward('/settings');
  }

  openImage(id: string): void {
    this.router.navigate(['image', id]);
  }

  async logOut(): Promise<void> {
    const confirm = this.alertCtrl.create({
      header: 'Logout',
      message:
        'About to logout? Don\'t worry, reality bites less when it\'s not in binary!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: 'Logout',
          role: 'exit',
          handler: async () => {
            await this.authService.logout();
            this.router.navigateByUrl('login');
          },
        },
      ],
    });
    (await confirm).present();
  }

  updateName(): void {
    this.userProfileSubscription = this.userProfile$
      .pipe(first())
      .subscribe(async (userProfile) => {
        const alert = await this.alertCtrl.create({
          subHeader: 'Username',
          inputs: [
            {
              type: 'text',
              name: 'fullName',
              placeholder: 'Your username',
              value: userProfile.fullName,
            },
          ],
          buttons: [
            { text: 'Cancel' },
            {
              text: 'Save',
              handler: async (data) => {
                const updatedFullName = data.fullName;

                if (updatedFullName.length > 25) {
                  const toast = await this.toastCtrl.create({
                    message: 'Username cannot exceed 25 characters.',
                    duration: 3000,
                    position: 'bottom',
                  });
                  await toast.present();
                  return false;
                }

                this.profileStore.updateUserName(updatedFullName);
                await this.updateDisplayName(updatedFullName);
              },
            },
          ],
        });
        return await alert.present();
      });
  }

  async updateDisplayName(newDisplayName: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, { displayName: newDisplayName });
      } catch (error) { }
    }
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
          handler: (data) => {
            this.profileStore.updateUserEmail({
              email: data.newEmail,
              password: data.password,
            });
          },
        },
      ],
    });
    return await alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: (data) => {
            this.profileStore.updateUserPassword({
              newPassword: data.newPassword,
              oldPassword: data.oldPassword,
            });
          },
        },
      ],
    });
    return await alert.present();
  }

  segmentChanged() { }

  async fetchImages() {
    if (this.selectedSegment === 'posts') {
      this.images = await this.imageService.getUserPosts();
      console.log(this.images)
    } else if (this.selectedSegment === 'comments') {
      this.comments = await this.imageService.getUserPostsComments();
      console.log(this.comments)
    } else if (this.selectedSegment === 'stars') {
    }
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

  async deleteImage(image: Image) {
    const confirm = this.alertCtrl.create({
      header: 'Delete',
      message:
        'About to delete a post. 🤠 Ready to hit `delete` on that post?',
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
            const userId = user.uid;
            try {
              if (image.postedBy === userId) {
                const firestore = getFirestore();
                const postsCollection = collection(firestore, 'posts');
                const postRef = doc(postsCollection, image.id);

                await deleteDoc(postRef);
                this.fetchImages();

                const toast = this.toastCtrl.create({
                  message:
                    'Your post has been deleted from the app repository!',
                  duration: 5000,
                  position: 'bottom',
                  color: 'success',
                });
                (await toast).present();

                //console.log(`Post with ID ${image.id} deleted`);
              } else {
                //console.error('You are not authorized to delete this post.');
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
    const displayName = this.fullNames || 'devvscape_user';

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
}
