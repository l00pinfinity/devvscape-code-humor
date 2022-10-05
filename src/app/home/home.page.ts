import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataService, Images } from '../services/data.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private data: DataService,public toastCtrl: ToastController, private onlineStatusService: OnlineStatusService) {
    
    this.onlineStatusService.status.subscribe(async (status:OnlineStatusType) => {
      if (status === OnlineStatusType.OFFLINE) {
        const toast = this.toastCtrl.create({
          message: "You are offline. Please connect to the internet.",
          duration: 5000,
          position: 'bottom',
          color: 'danger'
        });
         await (await toast).present();
      }
    })
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getImages(): Images[] {
    return this.data.getImages();
  }
  

}
