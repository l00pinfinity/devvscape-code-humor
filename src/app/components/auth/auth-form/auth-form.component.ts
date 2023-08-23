import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserCredential } from 'src/app/core/interface/user';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  public loading: HTMLIonLoadingElement;
  public authForm: FormGroup;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() actionButtonText: string;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() isPasswordResetPage = false;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit() {}

  submitCredentials(authForm: FormGroup): void {
    if (!authForm.valid) {
      console.log('Form is not valid yet, current value:', authForm.value);
    } else {
      this.showLoading();
      const credentials: UserCredential = {
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

  async handleError(error: { message: any }): Promise<void> {
    this.hideLoading();
    const toast = this.toastCtrl.create({
      message: `${error.message}`,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    });
    (await toast).present();
  }
}
