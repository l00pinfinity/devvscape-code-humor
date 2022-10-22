import { Component, ErrorHandler, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { Images } from '../core/interface/images';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, interval, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  images$: any;
  page = 0;

  constructor(private data: DataService,private authService:AuthService, private router:Router,private onlineStatusService: OnlineStatusService, private alertController: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {
    
    this.onlineStatusService.status.subscribe(async (status:OnlineStatusType) => {
      if (status === OnlineStatusType.OFFLINE) {
        const toast = this.toastCtrl.create({
          message: "You are offline. Please connect to the internet.",
          duration: 5000,
          position: 'bottom',
          color: 'danger'
        });
         await (await toast).present();
         setTimeout(async () =>{
          (await toast).dismiss();
        },3000);
      }
    })
  }

  doRefresh(event: { detail: { complete: () => void; }; }) {
    this.getPaginatedImages(false, "");
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }
  
  getImages(){
  }

  getImageById(id:number){
    this.data.getImageById(id).subscribe(
      (response:any) =>{
        if(response){
          // console.log(response);
          //save the id
        }
        this.page++;
      },async (error:Error | HttpErrorResponse) =>{
        const toast = this.toastCtrl.create({
          message: `${error}`,
          duration: 10000,
          position:'bottom',
          color: 'danger'
        });
        (await toast).present();
        setTimeout(async () =>{
          (await toast).dismiss();
        },1000);
      })
  }

  public getPaginatedImages(isFirstLoad,event){
        this.data.getPaginatedImages(this.page).subscribe(
          (response:any) =>{
            if(response){
              // console.log(response);
              this.images$ = response;
            }
            if(isFirstLoad){
              event.target.complete();
            }
            this.page++;
          },async (error:Error | HttpErrorResponse) =>{
            const toast = this.toastCtrl.create({
              message: `${error}`,
              duration: 10000,
              position:'bottom',
              color: 'danger'
            });
            (await toast).present();
            setTimeout(async () =>{
              (await toast).dismiss();
            },1000);
          })
  }

  onSelect(image:Images){
    console.log(image);
  }

  ngOnInit(){
    this.isAccessTokenPresent();
    this.authService.refresh();
  }

  ionViewWillLeave(){
    this.isAccessTokenPresent(); 
    this.authService.refresh();   
  }

  isAccessTokenPresent(){
    if(localStorage.getItem('devvscapeFirstAppLoad')){
      //already been loaded
      if(localStorage.getItem('devvsapeAccessToken') && localStorage.getItem('expiresIn')){
        this.getPaginatedImages(false,"");
      }else{
        this.router.navigateByUrl('/login');
        this.isAccessTokenPresent();
      }
    }else{
      localStorage.setItem('devvscapeFirstAppLoad','yes');
      this.router.navigateByUrl('/signup')
    }
  }

  toggle(event){
    console.log(event);
  }
}
