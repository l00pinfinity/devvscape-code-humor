import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredential } from 'src/app/core/interface/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthFormComponent } from '../../auth-form/auth-form.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild(AuthFormComponent)
  signupForm: AuthFormComponent;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  async signupUser(credentials: UserCredential): Promise<void> {
    try {
      const user = await this.authService.signup(
        credentials.email,
        credentials.password
      );
      this.authService.userId = user.uid;
      await this.signupForm.hideLoading();
      this.router.navigateByUrl('home');
    } catch (error) {
      await this.signupForm.hideLoading();
      this.signupForm.handleError(error);
    }
  }
}
