import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../core/services/data.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { Images } from '../core/interface/images';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { TokenStorageService } from '../core/services/token-storage.service';
import { Router } from '@angular/router';
import { VersionService } from '../core/services/version.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  images$: any;
  page = 0;
  likedImage?: Images;
  downloaded?: Images;
  loadingAsset = "../../assets/loading.gif";
  currentVersion:string;
  loading: boolean;

  constructor(private data: DataService, private authService: AuthService,private version:VersionService, private tokenStorage: TokenStorageService, private router: Router, private onlineStatusService: OnlineStatusService, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {    
    this.onlineStatusService.status.subscribe(async (status: OnlineStatusType) => {
      if (status === OnlineStatusType.OFFLINE) {
        const toast = this.toastCtrl.create({
          message: "You are offline. Please connect to the internet.",
          duration: 5000,
          position: 'bottom',
          color: 'danger',
          icon: 'wifi'
        });
        await (await toast).present();
        setTimeout(async () => {
          (await toast).dismiss();
        }, 3000);
      }
    })
  }

  doRefresh(event) {
    this.getPaginatedImages(false, "");
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }

  getImages() {
    this.data.getImages().subscribe((response: any) => {
      if (response) {

      }
    }, async (error: Error | HttpErrorResponse) => {
      const toast = this.toastCtrl.create({
        message: `${error}`,
        duration: 10000,
        position: 'bottom',
        color: 'danger'
      });
      (await toast).present();
      setTimeout(async () => {
        (await toast).dismiss();
      }, 1000);
    })
  }

  getImageById(id: number) {
    this.data.getImageById(id).subscribe(
      (response: any) => {
        if (response) {
          // console.log(response);
          //save the id
        }
      }, async (error: Error | HttpErrorResponse) => {
        const toast = this.toastCtrl.create({
          message: `${error}`,
          duration: 10000,
          position: 'bottom',
          color: 'danger'
        });
        (await toast).present();
        setTimeout(async () => {
          (await toast).dismiss();
        }, 1000);
      })
  }

  public getPaginatedImages(isFirstLoad, event) {
    this.data.getPaginatedImages(this.page).subscribe(
      (response: any) => {
        if (response) {
          // console.log(response);
          this.images$ = response;
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

        //redirect to login to update token
        this.router.navigateByUrl('/login')
      })
  }

  onSelect(image: Images) {
    // console.log(image.id + ' selected');
  }

  ngOnInit() {
    this.isAccessTokenPresent();
    this.currentVersion = this.version.getCurrentVersion();
    this.loading = this.authService.isPageLoading();
  }

  ionViewWillLeave() {
    this.isAccessTokenPresent();
    this.authService.refresh();
  }

  isAccessTokenPresent() {
    if (localStorage.getItem('devvscapeFirstAppLoad')) {
      //already been loaded
      if (this.tokenStorage.getAccessToken()) {
        this.getPaginatedImages(false, "");
      } else {
        this.router.navigateByUrl('/login');
        this.isAccessTokenPresent();
      }
    } else {
      localStorage.setItem('devvscapeFirstAppLoad', 'yes');
      this.router.navigateByUrl('/signup')
    }
  }

  toggle(event) {
    console.log(event);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
