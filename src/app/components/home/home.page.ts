import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Router } from '@angular/router';
import { Images } from 'src/app/core/interface/images';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { VersionService } from 'src/app/core/services/version.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Http } from '@capacitor-community/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  images$: any;
  randomImages$: any;
  selectedImage?: Images;
  page = 0;
  likedImage?: Images;
  downloaded?: Images;
  loading: boolean = true;
  currentVersion: string;
  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no' 
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'yes', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };
  segmentModel = "random";


  constructor(private data: DataService, private http: HttpClient, private authService: AuthService, private version: VersionService, private tokenStorage: TokenStorageService, private router: Router, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, private iab: InAppBrowser, private alertController: AlertController) {

  }


  segmentChanged(event: any) {
    //console.log(this.segmentModel);
    event.preventDefault();
    //console.log(event);
  }

  doRefresh(event) {
    this.getPaginatedImages(false, "");
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }

  async getPaginatedImages(isFirstLoad, event) {
    try {
      this.data.getPaginatedImages(this.page).subscribe(
        async (response: any) => {
          if (response) {
            // console.log(response);
            this.images$ = response;
          } else {
            const toast = this.toastCtrl.create({
              message: "Something went wrong! Try again",
              duration: 10000,
              position: 'bottom',
              color: 'danger',
              icon: 'sad'
            });
            (await toast).present();
            setTimeout(async () => {
              (await toast).dismiss();
            }, 1000);
          }

          if (isFirstLoad) {
            event.target.complete();
          }
          this.page++;
        }, async (error: Error | HttpErrorResponse) => {
          const toast = this.toastCtrl.create({
            message: `${error.message}`,
            duration: 10000,
            position: 'bottom',
            color: 'danger',
            icon: 'sad'
          });
          (await toast).present();
          setTimeout(async () => {
            (await toast).dismiss();
          }, 1000);

          //just loggout the user to login
          this.authService.logout();

          //redirect to login to update token
          this.router.navigateByUrl('/login')
        })
    } catch (error) {
      const toast = this.toastCtrl.create({
        message: error,
        duration: 10000,
        position: 'bottom',
        color: 'danger',
        icon: 'sad'
      });
      (await toast).present();
      setTimeout(async () => {
        (await toast).dismiss();
      }, 1000);

      //redirect to login to update token
      this.router.navigateByUrl('/login')
    }
  }

  async getRandomImages() {
    try {
      this.data.getRandomImages().subscribe(
        async (response: any) => {
          if (response) {
            //console.log(response);
            this.randomImages$ = response;
          } else {
            const toast = this.toastCtrl.create({
              message: "Something went wrong! Try again",
              duration: 10000,
              position: 'bottom',
              color: 'danger',
              icon: 'sad'
            });
            (await toast).present();
            setTimeout(async () => {
              (await toast).dismiss();
            }, 1000);
          }
        }, async (error: Error | HttpErrorResponse) => {
          const toast = this.toastCtrl.create({
            message: `${error.message}`,
            duration: 10000,
            position: 'bottom',
            color: 'danger',
            icon: 'sad'
          });
          (await toast).present();
          setTimeout(async () => {
            (await toast).dismiss();
          }, 1000);

          //just loggout the user to login
          this.authService.logout();

          //redirect to login to update token
          this.router.navigateByUrl('/login')
        })
    } catch (error) {
      const toast = this.toastCtrl.create({
        message: error,
        duration: 10000,
        position: 'bottom',
        color: 'danger',
        icon: 'sad'
      });
      (await toast).present();
      setTimeout(async () => {
        (await toast).dismiss();
      }, 1000);

      //redirect to login to update token
      this.router.navigateByUrl('/login')
    }
  }

  ngOnInit() {
    setTimeout(() => {
      //delay for three seconds
      this.loading = false;
    }, 4000)
    this.isAccessTokenPresent();
    this.currentVersion = this.version.getCurrentVersion();
  }

  async showActionSheet(image: Images) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select any of the actions below to proceed',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Download',
          icon: 'download',
          data: 10,
          handler: async () => {
            const imageUrl = image.imageUrl;            

            // Get the image file name from the URL
            const parsedUrl = new URL(imageUrl);
            const fileName = parsedUrl.pathname.split('/').pop();  // Output: "mFkSDpCKvk.jpg"

            Http.downloadFile({
              url: imageUrl,
              filePath: `${fileName}`
            }).then(async (result) => {
              const toast = this.toastCtrl.create({
                message: "Image downloaded successfully",
                duration: 5000,
                position: 'bottom',
                color: 'success',
                icon: 'image'
              });
              (await toast).present();
              setTimeout(async () => {
                (await toast).dismiss();
              }, 3000);
              console.log('Image downloaded successfully: ' + result.path);
            }, async (error) => {
              const toast = this.toastCtrl.create({
                message: "Error downloading image! Try again",
                duration: 5000,
                position: 'bottom',
                color: 'danger',
                icon: 'sad'
              });
              (await toast).present();
              setTimeout(async () => {
                (await toast).dismiss();
              }, 3000);
              console.error('Error downloading image: ' + error);
            });
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  public openWithSystemBrowser(url: string) {
    let target = "_system";
    this.iab.create(url, target, this.options);
  }
  public openWithInAppBrowser(url: string) {
    let target = "_blank";
    this.iab.create(url, target, this.options);
  }

  ionViewWillLeave() {
    this.isAccessTokenPresent();
    this.authService.refresh();
  }

  async isAccessTokenPresent() {
    if (localStorage.getItem('devvscapeFirstAppLoad')) {
      //already been loaded
      if (this.tokenStorage.getAccessToken()) {
        this.getRandomImages();
        this.getPaginatedImages(false, "");
      } else {
        const toast = this.toastCtrl.create({
          message: "Please verify your login credentials and try again",
          duration: 10000,
          position: 'bottom',
          color: 'danger',
          icon: 'sad'
        });
        (await toast).present();
        setTimeout(async () => {
          (await toast).dismiss();
        }, 2000);
        //redirect back to login page
        this.router.navigateByUrl('/login');
      }
    } else {
      localStorage.setItem('devvscapeFirstAppLoad', 'yes');
      this.router.navigateByUrl('/signup')
    }
  }

  toggle(event) {
    console.log(event);
  }

  async logout() {
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Logging out...',
        duration: 10000,
        cssClass: 'custom-loading',
      });
      loading.present();
      this.authService.logout();
      this.router.navigateByUrl('/login');
      loading.dismiss();
    } catch (error) {
      const toast = this.toastCtrl.create({
        message: error,
        duration: 10000,
        position: 'bottom',
        color: 'danger',
        icon: 'sad'
      });
      (await toast).present();
      setTimeout(async () => {
        (await toast).dismiss();
      }, 1000);
    }
  }



  async scheduleNotification() {
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Stop scrolling through boring code! ',
          body: 'Get your daily dose of laughs and keep your coding skills sharp! 🤣👨‍💻🚀',
          id: 1,
          schedule: {
            on: { hour: 18, minute: 0 },
            repeats: true
          },
          sound: "default",
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }

}
