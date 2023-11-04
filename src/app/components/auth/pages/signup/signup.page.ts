import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredential } from 'src/app/core/interface/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthFormComponent } from '../../auth-form/auth-form.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification } from 'src/app/core/interface/notification.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild(AuthFormComponent)
  signupForm: AuthFormComponent;
  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router) {}

  ngOnInit() {}

  async signupUser(credentials: UserCredential): Promise<void> {
    try {
      const user = await this.authService.signup(
        credentials.username,
        credentials.email,
        credentials.password
      );
      this.authService.userId = user.uid;

      const notification: Notification = {
        title: 'Welcome, Memelord!',
        body: 'Welcome to the elite league of developer memers! Get ready for epic coding and meme adventures!',
        isRead: false,
        type: 'newUser',
        userId: user.uid,
        createdAt: new Date(),
      };

      await this.notificationService.addNotification(user.uid, notification);

      await this.signupForm.hideLoading();
      this.router.navigateByUrl('images');
    } catch (error) {
      await this.signupForm.hideLoading();
      this.signupForm.handleError(error);
    }
  }
}
