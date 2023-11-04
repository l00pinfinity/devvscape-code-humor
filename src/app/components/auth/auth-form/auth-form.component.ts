import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { ErrorResponse } from 'src/app/core/interface/firebase.interface';
import { UserCredential } from 'src/app/core/interface/user.interface';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  public loading: HTMLIonLoadingElement;
  public authForm: FormGroup;
  @Input() actionButtonText: string;
  @Input() isPasswordResetPage = false;
  @Input() isLoginPage = false;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.minLength(1)],  
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit() { }

  submitCredentials(authForm: FormGroup): void {
    if (!authForm.valid) {
      console.log('Form is not valid yet, current value:', authForm.value);
    } else {
      this.showLoading();
      const credentials: UserCredential = {
        username: authForm.value.username,
        email: authForm.value.email,
        password: authForm.value.password,
      };
      this.formSubmitted.emit(credentials);
    }
  }

  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Loading...',
        cssClass: 'custom-loading',
      });
      await this.loading.present();
    } catch (error) {
      this.handleError(error);
    }
  }

  async hideLoading(): Promise<boolean> {
    if (this.loading) {
      return this.loading.dismiss();
    }
    return false;
  }

  async handleError(error: ErrorResponse): Promise<void> {
    this.hideLoading();

    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Account with this email address is already in use. Please login.',
      'auth/missing-password': 'Please enter a password to continue.',
      'auth/invalid-email': 'Please enter a valid email address to continue.',
      'auth/popup-closed-by-user': 'Popup was closed by the user. Please try again.',
      'auth/popup-blocked': 'Popup window was blocked by your browser. Please allow popups and try again.',
      'auth/cancelled-popup-request': 'Popup request was cancelled. Please try again.',
      'auth/network-request-failed': 'Network request failed. Please check your internet connection and try again.',
      'auth/user-not-found': 'User not found. Please check your email.',
      'auth/wrong-password': 'Wrong password. Please try again.',
      'auth/too-many-requests':'Access to this account has been temporarily disable due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
      'auth/requires-recent-login':'To delete account requires recent login, login and try again'
    };

    const errorMessage = errorMessages[error.code] || error.message;

    const toast = this.toastCtrl.create({
      message: errorMessage,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    });

    (await toast).present();
  }
}
