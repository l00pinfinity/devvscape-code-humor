import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredential } from 'src/app/core/interface/user';
import { AuthFormComponent } from '../../auth-form/auth-form.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent) loginForm: AuthFormComponent;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  async loginUser(credentials: UserCredential): Promise<void> {
    try {
      const userCredential = await this.authService.login(
        credentials.email,
        credentials.password
      );
      this.authService.userId = userCredential.user.uid;
      console.log('Logged in user',userCredential);
      await this.loginForm.hideLoading();
      this.router.navigateByUrl('images');
    } catch (error) {
      await this.loginForm.hideLoading();
      this.loginForm.handleError(error);
    }
  }
}
