import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserProfile } from 'src/app/core/interface/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ProfileStore } from './profile.store';
import { Auth, updateProfile } from '@angular/fire/auth';
import { ImageService } from 'src/app/core/services/image.service';
import { Image } from 'src/app/core/interface/image';
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
  public userProfile$: Observable<UserProfile> = this.profileStore.userProfile$;
  private userProfileSubscription: Subscription;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  images: any[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  selectedSegment = 'posts';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  imageLoaded = false;

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router,
    private profileService: ProfileService,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private readonly profileStore: ProfileStore
  ) {}

  ngOnInit(): void {
    this.userProfileSubscription = this.profileService
      .getUserProfile()
      .subscribe((userProfile: UserProfile) =>
        this.profileStore.setState(userProfile)
      );
    this.fetchImages();
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

  async logOut(): Promise<void> {
    const confirm = this.alertCtrl.create({
      header: 'Logout',
      message:
        'About to logout? Don\'t worry, reality bites less when it\'s not in binary!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
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
                this.profileStore.updateUserName(updatedFullName);

                // Update the displayName in Firebase Authentication
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
        //console.log('Display name updated in auth:', newDisplayName);
      } catch (error) {
        //console.error('Error updating display name in auth:', error);
      }
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

  segmentChanged() {}

  async fetchImages() {
    if (this.selectedSegment === 'posts') {
      this.images = await this.imageService.getUserPosts();
    } else if (this.selectedSegment === 'comments') {
    } else if (this.selectedSegment === 'stars') {
    }
  }

  async deleteImage(image: Image) {
    const confirm = this.alertCtrl.create({
      header: 'Delete',
      message:
        'About to delete a post? Don\'t worry, reality bites less when it\'s not in binary!',
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

                console.log(`Post with ID ${image.id} deleted`);
              } else {
                console.error('You are not authorized to delete this post.');
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
}
