import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loginStatus: any;
  errorMessage: string;
  isLoggedIn = false;
  isLoginFailed = false;
  currentVersion: string;

  constructor(private router: Router, private authService: AuthService, private version: VersionService, private tokenStorage: TokenStorageService, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup<any> {
    return new FormGroup({
      usernameOrEmail: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  ngOnInit(): void {
    this.currentVersion = this.version.getCurrentVersion();
    localStorage.setItem('devvscapeFirstAppLoad', 'yes');
    if (this.tokenStorage.getAccessToken()) {
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  async onLogin() {
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Logging in...',
        duration: 3000,
        cssClass: 'custom-loading',
      });
      loading.present();

      if (this.usernameOrEmail && this.password) {
        this.authService.login(this.usernameOrEmail.value, this.password.value).subscribe((response: any) => {
          if (response) {
            // console.log(response);
            this.tokenStorage.setSession(response);
            // console.log("User is logged in");
            this.isLoggedIn = true;
            this.isLoginFailed = false;
            this.router.navigateByUrl('/home');
            loading.dismiss();
          } else {
            this.loginStatus = response;
            this.errorMessage = this.loginStatus.message;
            this.isLoginFailed = true;
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

  reloadPage(): void {
    window.location.reload();
  }

  //getters
  get usernameOrEmail() {
    return this.loginForm.get('usernameOrEmail');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
