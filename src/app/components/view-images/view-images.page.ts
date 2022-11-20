import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DataService } from '../../core/services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.page.html',
  styleUrls: ['./view-images.page.scss'],
})
export class ViewImagesPage implements OnInit {
  images:any;

  constructor(private route: ActivatedRoute,private data: DataService,private location: Location, public toastCtrl: ToastController) { }

  async viewImageById(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      this.data.getImageById(id).subscribe(
        async (response: any) => {
          if (response) {
            console.log(response);
            this.images = response;
          }else{
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
    }
  }

  ngOnInit() {
    console.log("Clicked")
    this.viewImageById();
  }

}
