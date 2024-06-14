import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../../auth-form/auth-form.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthLoading, selectAuthError, selectUser } from 'src/app/core/store/selectors/auth.selectors';
import { login, setLoading } from 'src/app/core/store/actions/auth.actions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(AuthFormComponent) loginForm!: AuthFormComponent;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private store: Store, private router:Router, private authService: AuthService, public toastCtrl: ToastController) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user) {
        const successToast = await this.toastCtrl.create({
          message: 'Logged in...',
          duration: 5000,
          position: 'bottom',
          color: 'success',
        });
        await successToast.present();
        this.router.navigateByUrl('');
      }
    });
  }

  loginUser(credentials: { email: string; password: string; }) {
    const { email, password } = credentials;
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(login({ email, password }));

    this.store.select(selectUser).subscribe(user =>{
      if (user){
        this.router.navigateByUrl('');
      }
    })
  }
}