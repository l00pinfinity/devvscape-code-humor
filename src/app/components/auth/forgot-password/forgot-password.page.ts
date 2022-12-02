import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  emailForm:FormGroup

  constructor(private router: Router, private authService: AuthService, private version: VersionService, private tokenStorage: TokenStorageService, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.emailForm = this.createFormGroup()
   }

  createFormGroup(): FormGroup<any> {
    return new FormGroup({
      email: new FormControl('', [Validators.required,Validators.email])
    })
  }

  async sendToken(){
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Sending token...',
        duration: 10000,
        cssClass: 'custom-loading',
      });
      loading.present();

      if (this.email) {
        this.authService.forgotPassword(this.email.value).subscribe(async (response: any) => {
          if (response) {
            // console.log(response);
            const toast = this.toastCtrl.create({
              message: response.message,
              duration: 10000,
              position: 'bottom',
              color: 'danger',
              icon: 'happy'
            });
            (await toast).present();
            setTimeout(async () => {
              (await toast).dismiss();
            }, 3000);
            this.router.navigateByUrl('/reset');
            loading.dismiss();
          } else {
            const toast = this.toastCtrl.create({
              message: "Something went wrong try again later!",
              duration: 10000,
              position: 'bottom',
              color: 'danger',
              icon: 'sad'
            });
            (await toast).present();
            setTimeout(async () => {
              (await toast).dismiss();
            }, 3000);
            loading.dismiss();
          }
        }, async (error: Error | HttpErrorResponse) => {
          loading.dismiss();
          const toast = this.toastCtrl.create({
            message: `${error}`,
            duration: 10000,
            position: 'bottom',
            color: 'danger',
            icon: 'sad'
          });
          (await toast).present();
          setTimeout(async () => {
            (await toast).dismiss();
          }, 3000);
        })
      }
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
  }

  get email() {
    return this.emailForm.get('email');
  }

}
