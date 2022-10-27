import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PasswordValidators } from 'src/app/core/validators/password-validators';
import { AuthService } from 'src/app/core/services/auth.service';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  signupStatus: any;
  errorMessage:string;
  isSuccessul = false;
  isSignUpFailed = false;
  currentVersion: string;

  constructor(private router: Router, private authService: AuthService,private version:VersionService, private toastCtrl: ToastController) {
    this.signupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup<any> {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      bio: new FormControl('', Validators.required)
    }, PasswordValidators.MatchValidator('password', 'confirmpassword'))
  }

  ngOnInit() {
    this.currentVersion = this.version.getCurrentVersion();
    this.authService.logout();
    localStorage.setItem('devvscapeFirstAppLoad','yes');
  }

  onSignUp():void {
    if (this.email && this.username, this.password, this.bio) {
      this.authService.signup(this.email.value, this.username.value, this.password.value, this.bio.value).subscribe(async (response: any) => {
        if (response.success == true) {
          console.log(response);        
          this.isSuccessul = true;  
          this.router.navigateByUrl('/login');
        }else{
          this.signupStatus = response;
          this.errorMessage = this.signupStatus.message;
          this.isSignUpFailed = true;
          const toast = this.toastCtrl.create({
            message: this.errorMessage,
            duration: 10000,
            position: 'bottom',
            color: 'danger',
            icon: 'sad'
          });
          (await toast).present();
          setTimeout(async () => {
            (await toast).dismiss();
          }, 3000)
        }
      }, async (error: Error | HttpErrorResponse) => {
        this.isSignUpFailed = true;
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
        }, 3000)
      })
    }
  }

  //getters
  get email() {
    return this.signupForm.get('email');
  }

  get username() {
    return this.signupForm.get('username');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmpassword() {
    return this.signupForm.get('confirmpassword');
  }

  get bio() {
    return this.signupForm.get('bio');
  }

  get passwordMatchError() {
    return (this.signupForm.getError('mismatch') && this.signupForm.get('confirmpassword')?.touched)
  }

}
