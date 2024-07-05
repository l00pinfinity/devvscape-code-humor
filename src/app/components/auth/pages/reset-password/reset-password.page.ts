import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../../auth-form/auth-form.component';
import { Store } from '@ngrx/store';
import { resetPassword, setLoading } from 'src/app/core/store/actions/auth.actions';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  @ViewChild(AuthFormComponent) resetPasswordForm!: AuthFormComponent;

  constructor(private adMobService: AdMobService, private store: Store) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.adMobService.hideBannerAd('home-banner-ad');
  }

  ionViewWillLeave() {
    this.adMobService.showBannerAd('home-banner-ad','ca-app-pub-6424707922606590/3709250809');
  }

  resetPassword(credentials: { email: string; }){
    const { email } = credentials; 
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(resetPassword({ email }));
  }

}