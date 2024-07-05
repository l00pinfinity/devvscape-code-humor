import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormComponent } from '../../auth-form/auth-form.component';
import { setLoading, signup } from 'src/app/core/store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading, selectUser } from 'src/app/core/store/selectors/auth.selectors';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastController } from '@ionic/angular';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild(AuthFormComponent) signupForm!: AuthFormComponent;

  loading$: Observable<boolean>;
  error$: Observable<any>;
  
  constructor(private store: Store, private router:Router, private authService: AuthService, private adMobService: AdMobService,public toastCtrl: ToastController) {
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
        this.router.navigateByUrl(''); // Redirect to the root route
      }
    });
  }

  ionViewWillEnter() {
    this.adMobService.hideBannerAd('home-banner-ad');
  }

  ionViewWillLeave() {
    this.adMobService.showBannerAd('home-banner-ad','ca-app-pub-6424707922606590/3709250809');
  }

  signupUser(credentials: { email: string; password: string; username: string }) {
    const { email, password, username } = credentials;
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(signup({ email, password, username}));

    this.store.select(selectUser).subscribe(user =>{
      if (user){
        this.router.navigateByUrl('');
      }
    })
  }

}