import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserCredential } from 'src/app/core/interface/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthFormComponent } from '../../auth-form/auth-form.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  @ViewChild(AuthFormComponent)
  resetPasswordForm: AuthFormComponent;
  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  async resetPassword(credentials: UserCredential): Promise<void> {
    try {
      await this.authService.resetPassword(credentials.email);
      await this.resetPasswordForm.hideLoading();
      const alert = await this.alertCtrl.create({
        message: 'Check your inbox for the password reset link',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.router.navigateByUrl('login');
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      await this.resetPasswordForm.hideLoading();
      this.resetPasswordForm.handleError(error);
    }
  }
}
