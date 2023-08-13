import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ImageService } from 'src/app/core/services/image.service';
import { Image } from '../../core/interface/image';
import { Auth } from '@angular/fire/auth';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public welcomeMessage = '';
  presentingElement = undefined;
  imageFile: File | null = null;
  postText = '';
  imageSrc: string | ArrayBuffer | null = null;
  images: Image[] = [];
  lastDocument: DocumentSnapshot | undefined;
  public loading: HTMLIonLoadingElement;
  errorOccurred = false;
  errorMessage = '';

  constructor(
    private auth: Auth,
    private imageService: ImageService,
    private navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private onlineStatusService: OnlineStatusService
  ) {}

  async ngOnInit(): Promise<void> {
    this.setWelcomeMessage();
    this.checkOnlineStatus();
    this.presentingElement = document.querySelector('.ion-page');
    this.fetchImagePosts();
  }
  async fetchImagePosts() {
    try {
      this.images = await this.imageService.getImagePosts();
      console.log(this.images);
      this.errorOccurred = false;
    } catch (error) {
      this.errorOccurred = true;
      this.errorMessage = 'Something went wrong, try again later';

      const toast = await this.toastCtrl.create({
        message: this.errorMessage,
        duration: 5000,
        position: 'bottom',
        color: 'danger',
        icon: 'alert',
      });

      await toast.present();
    }
  }

  refresh(ev: any) {
    this.fetchImagePosts();
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  setWelcomeMessage(): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.welcomeMessage = 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.welcomeMessage = 'Good afternoon';
    } else {
      this.welcomeMessage = 'Good evening';
    }
  }

  async openModal() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(
        (result) => console.log('Has permission?', result.hasPermission),
        async () => {
          const hasPermission = await this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          );
          if (!hasPermission.hasPermission) {
            const confirm = this.alertCtrl.create({
              header: 'Permission Denied',
              message: 'Storage permission is required to upload images.',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {},
                },
              ],
            });
            (await confirm).present();
          }
        }
      );

    const modalElement = document.getElementById('open-modal');
    const modal = await this.modalCtrl.create({
      component: modalElement,
    });

    await modal.present();
  }

  openProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  openNotification() {
    this.navCtrl.navigateForward('/notifications');
  }

  async uploadImageAndPostText() {
    const user = this.auth.currentUser;
    console.log('Clicked upload with text ' + this.postText + '.');
    if (this.imageFile) {
      this.showLoading();
      await this.imageService.uploadImageAndPostText(
        this.imageFile,
        this.postText,
        user.uid,
        user.displayName,
      );

      this.hideLoading();
      // Dismiss the modal after successful upload
      this.modalController.dismiss();

      const toast = this.toastCtrl.create({
        message: 'Your post has been committed to the app repository!',
        duration: 5000,
        position: 'bottom',
        color: 'success',
      });
      (await toast).present();

      this.imageFile = null;
      this.postText = '';
      this.imageSrc = null;

      this.fetchImagePosts();
    }
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length) {
      this.imageFile = inputElement.files[0];
      this.displaySelectedImage();
    }
  }

  displaySelectedImage() {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.imageSrc = event.target?.result;
    };
    reader.readAsDataURL(this.imageFile);
  }

  cancelImageSelection() {
    this.imageFile = null;
    this.imageSrc = null;
  }

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

  hideLoading(): Promise<boolean> {
    return this.loading.dismiss();
  }

  async handleError(error: { message: any }): Promise<void> {
    const toast = this.toastCtrl.create({
      message: `${error.message}`,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    });
    (await toast).present();
  }

  checkOnlineStatus() {
    this.onlineStatusService.status.subscribe(
      async (status: OnlineStatusType) => {
        if (status === OnlineStatusType.OFFLINE) {
          const toast = this.toastCtrl.create({
            message: 'Looks like you are in the land of offline adventures!',
            duration: 5000,
            position: 'bottom',
            color: 'danger',
            icon: 'alert',
          });
          await (await toast).present();
          setTimeout(async () => {
            (await toast).dismiss();
          }, 3000);
        }
      }
    );
  }
}
