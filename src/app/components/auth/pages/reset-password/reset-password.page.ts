import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../../auth-form/auth-form.component';
import { Store } from '@ngrx/store';
import { resetPassword, setLoading } from 'src/app/core/store/actions/auth.actions';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  @ViewChild(AuthFormComponent) resetPasswordForm!: AuthFormComponent;

  constructor(private store: Store) { }

  ngOnInit() { }

  resetPassword(credentials: { email: string; }){
    const { email } = credentials; 
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(resetPassword({ email }));
  }

}