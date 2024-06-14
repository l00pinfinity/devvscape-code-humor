import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject } from '@ngrx/store';
import * as AuthActions from '../../../core/store/actions/auth.actions';
import { Observable, Subject, Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ErrorResponse } from 'src/app/core/models/data/firebase.interface';
import { SignupCredentials } from 'src/app/core/models/data/user.interface';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit, OnDestroy {
  public loading!: HTMLIonLoadingElement;
  public authForm: FormGroup;
  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();
  private actionsSubscription!: Subscription;
  
  @Input() actionButtonText!: string;
  @Input() isPasswordResetPage = false;
  @Input() isLoginPage = false;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private actionsSubject: ActionsSubject
  ) {
    this.authForm = this.formBuilder.group({
      username: ['', [Validators.minLength(1),Validators.maxLength(25)]],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit() { 
    this.actionsSubscription = this.actionsSubject.pipe(
      ofType(AuthActions.loginFailure, AuthActions.signupFailure, AuthActions.logoutFailure, AuthActions.resetPasswordFailure, AuthActions.deleteAccountFailure),
      tap(action => this.handleError(action.error))
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.actionsSubscription) {
      this.actionsSubscription.unsubscribe();
    }
  }

  submitCredentials(authForm: FormGroup): void {
    if (!authForm.valid) {
      console.log('Form is not valid yet, current value:', authForm.value);
    } else {
      this.showLoading().pipe(
        tap(() => {
          const credentials: SignupCredentials = {
            username: authForm.value.username,
            email: authForm.value.email,
            password: authForm.value.password,
          };
          this.formSubmitted.emit(credentials);
        }),
        finalize(() => this.hideLoading())
      ).subscribe();
    }
  }

  showLoading(): Observable<void> {
    return new Observable<void>(observer => {
      this.loadingCtrl.create({
        message: 'Loading...',
        cssClass: 'custom-loading',
      }).then(loading => {
        this.loading = loading;
        this.loading.present().then(() => {
          this.loadingSubject.next(true);
          observer.next();
          observer.complete();
        });
      }).catch(error => {
        this.handleError(error);
        observer.error(error);
      });
    });
  }

  hideLoading(): void {
    if (this.loading) {
      this.loading.dismiss().then(() => this.loadingSubject.next(false));
    } else {
      this.loadingSubject.next(false);
    }
  }

  handleError(error: ErrorResponse): void {
    this.hideLoading();
  }
}
