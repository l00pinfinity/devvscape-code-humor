import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  NavController,
  ModalController,
  LoadingController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token, } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { selectAllImages, selectImageState, selectImagesLoaded } from 'src/app/core/store/selectors/image.selectors';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { Image } from 'src/app/core/models/data/image.interface';
import { ImageService } from 'src/app/core/services/image.service';
import { loadImages } from 'src/app/core/store/actions/image.actions';
import { loadBestStories } from 'src/app/core/store/actions/hacker-news.actions';
import { selectBestStories } from 'src/app/core/store/selectors/hacker-news.selectors';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  images$!: Observable<Image[]>;
  presentingElement: Element | null = null;
  imageFile: File | null = null;
  postText = '';
  imageSrc: string | ArrayBuffer | null = null;
  selectedSegment = 'for-you'
  loading!: HTMLIonLoadingElement;
  private modalInstance!: HTMLIonModalElement;
  onlineStatusSubscription!: Subscription;
  imagesLoaded$!: Observable<boolean>;
  bestStories$ = this.store.pipe(select(selectBestStories));

  constructor(private auth: Auth,
    private platform: Platform,
    private store: Store,
    private imageService: ImageService,
    private adMobService: AdMobService,
    private navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private onlineStatusService: OnlineStatusService,
  ) { }

  ngOnInit(): void {
    this.checkOnlineStatus();
    this.store.dispatch(loadBestStories());
    this.presentingElement = document.querySelector('.ion-page');
    this.notificationStatus();

    this.imagesLoaded$ = this.store.select(selectImagesLoaded);
    this.imagesLoaded$.pipe(
      map(loaded => {
        if (!loaded) {
          this.fetchImagePosts();
        }
      })
    ).subscribe();

    this.images$ = this.store.select(selectAllImages);
  }

  ngOnDestroy(): void {
    if (this.onlineStatusSubscription) {
      this.onlineStatusSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.adMobService.showBannerAd('home-banner-ad','ca-app-pub-6424707922606590/3709250809');
  }

  refresh(ev: any) {
    this.store.dispatch(loadImages());
    this.bestStories$ = this.store.pipe(select(selectBestStories));
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  async fetchImagePosts() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();
  
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();
  
    const imageState$ = this.store.select(selectImageState).pipe(
      map(state => {
        if (!state.loaded || (state.lastUpdated && (now - state.lastUpdated) > oneHour)) {
          this.store.dispatch(loadImages());
        }
        return state.loaded;
      })
    );
  
    imageState$.subscribe({
      next: (loaded) => {
        if (loaded) {
          loading.dismiss();
        }
      },
      error: () => loading.dismiss(),
      complete: () => loading.dismiss()
    });
  }
  

  async openPostModal() {
    const hasPermission = await this.checkStoragePermission();
    if (hasPermission) {
      const modalElement = document.getElementById('open-post-modal');
      this.modalInstance = await this.modalCtrl.create({
        component: modalElement,
      });
      await this.modalInstance.present();
    }
  }

  async checkStoragePermission(): Promise<boolean> {
    const permissionResult = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
    );

    if (!permissionResult.hasPermission) {
      const hasPermission = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      );

      if (!hasPermission.hasPermission) {
        const confirm = await this.alertCtrl.create({
          header: 'Permission Denied',
          message: 'Storage permission is required to upload images.',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
            },
          ],
        });
        await confirm.present();
        return false;
      }
    }
    return true;
  }

  async uploadImageAndPostText() {
    const user = this.auth.currentUser;

    if (this.imageFile && user && user.displayName) {
      this.showLoading();
      try {
        await this.imageService.uploadImageAndPostText(
          this.imageFile,
          this.postText.replace(/\n/g, '\\n'),
          user.uid,
          user.displayName
        );

        this.hideLoading();
        this.modalCtrl.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'Your post has been committed to the app repository!',
          duration: 5000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();

        this.imageFile = null;
        this.postText = '';
        this.imageSrc = null;

        this.store.dispatch(loadImages());
      } catch (error) {
        console.error('Error uploading image and post:', error);

        const errorToast = await this.toastCtrl.create({
          message: 'An error occurred while uploading your post. Please try again.',
          duration: 5000,
          position: 'bottom',
          color: 'danger',
        });
        await errorToast.present();

        this.hideLoading();
      }
    }
  }

  async onFileSelected(event: Event) { 
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length) {
      this.imageFile = inputElement.files[0];
      this.displaySelectedImage();
    }
  }
  

  displaySelectedImage() {
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result !== undefined) {
          this.imageSrc = event.target.result;
        }
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  cancelImageSelection() {
    this.imageFile = null;
    this.imageSrc = null;
  }

  trackImage(index: number, image: any): any {
    return image.id;
  }

  segmentChanged() { }

  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Uploading...',
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
    const errorMessage = customMessage || error.message || 'An error occurred';
    const toast = await this.toastCtrl.create({
      message: errorMessage,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

  async openModal() {
    const permissionResult = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
    );

    if (!permissionResult.hasPermission) {
      const hasPermission = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      );

      if (!hasPermission.hasPermission) {
        const confirm = await this.alertCtrl.create({
          header: 'Permission Denied',
          message: 'Storage permission is required to upload images.',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: async () => {
                if (this.modalInstance) {
                  await this.modalInstance.dismiss();
                }
              },
            },
          ],
        });
        await confirm.present();
        return;
      }
    }

    const modalElement = document.getElementById('open-modal');
    this.modalInstance = await this.modalCtrl.create({
      component: modalElement,
    });
    await this.modalInstance.present();
  }

  openProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  openNotification() {
    this.navCtrl.navigateForward('/notifications');
  }

  async notificationStatus() {
    PushNotifications.requestPermissions().then(async (result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        const confirm = await this.alertCtrl.create({
          header: 'Stay in the Loop!',
          message:
            'Unlock the magic of timely updates and stay connected. Allow notifications to receive the latest happenings!',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: async () => {
                this.openAppSettings();
              },
            },
          ],
        });
        await confirm.present();
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push registration error: ', error);
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification
        );
      });

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push notification action performed: ', notification);
        // Handle notification action, e.g., navigate to a specific page
        this.handleNotificationAction(notification);
      }
    );
  }

  handleNotificationAction(notification: ActionPerformed) {
    // Example: Navigate to a specific page based on the notification data
    const data = notification.notification.data;
    if (data.page) {
      this.navCtrl.navigateForward(data.page);
    }
  }

  async openAppSettings() {
    if (this.platform.is('android')) {
      const packageName = 'com.silkwebhq.devvscapecode';
      const intentUri = 'package:' + packageName;
      window.open('intent:' + intentUri + '#Intent;end;');
    } else if (this.platform.is('ios')) {
      // For iOS, direct users to the app settings
      const alert = await this.alertCtrl.create({
        header: 'Open Settings',
        message: 'Please go to the app settings and enable notifications.',
        buttons: [
          {
            text: 'Open Settings',
            handler: () => {
              // Open iOS app settings
              const settingsUrl = 'app-settings:';
              window.open(settingsUrl, '_system');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    }
  }

  async checkOnlineStatus() {
    this.onlineStatusSubscription = this.onlineStatusService.status
      .pipe(
        map(status => status === OnlineStatusType.OFFLINE)
      )
      .subscribe(async (isOffline) => {
        if (isOffline) {
          const toast = await this.toastCtrl.create({
            message: 'Looks like you are in the land of offline adventures!',
            duration: 5000,
            position: 'bottom',
            color: 'danger',
            icon: 'alert',
          });

          await toast.present();
          setTimeout(async () => {
            await toast.dismiss();
          }, 3000);
        }
      });
  }

  navigateToGames() {
    this.navCtrl.navigateForward('/tabs/home/games');
  }

  navigateToNews() {
    this.navCtrl.navigateForward('/tabs/home/news');
  }

  navigateToEvents() {
    this.navCtrl.navigateForward('/tabs/home/events');
  }
}
