import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { VersionService } from 'src/app/core/services/version.service';
import { PasswordValidators } from 'src/app/core/validators/password-validators';
import { WhitespaceValidators } from 'src/app/core/validators/whitespace-validators';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  passwordForm:FormGroup

  constructor(private router: Router, private authService: AuthService, private version: VersionService, private tokenStorage: TokenStorageService, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.passwordForm = this.createFormGroup()
   }

   createFormGroup(): FormGroup<any> {
    return new FormGroup({
      token: new FormControl('', [Validators.required, WhitespaceValidators.cannotContainWhitespace]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, PasswordValidators.MatchValidator('password', 'confirmpassword'))
  }

  async resetPassword(){
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Resetting password...',
        duration: 10000,
        cssClass: 'custom-loading',
      });
      loading.present();

      if (this.token && this.password) {
        this.authService.resetPassword(this.token.value,this.password.value).subscribe(async (response: any) => {
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
            this.router.navigateByUrl('/login');
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

  get token() {
    return this.passwordForm.get('token');
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmpassword() {
    return this.passwordForm.get('confirmpassword');
  }

  get passwordMatchError() {
    return (this.passwordForm.getError('mismatch') && this.passwordForm.get('confirmpassword')?.touched)
  }

}
