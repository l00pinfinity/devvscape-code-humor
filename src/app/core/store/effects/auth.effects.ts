import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { setLoading } from '../actions/auth.actions';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,private authService: AuthService, private alertCtrl: AlertController, private router: Router) { }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(() => setLoading({ loading: true })),
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(user => AuthActions.loginSuccess({ user })),
          catchError(error => {
            console.error('Login error:', error); // Log the error here
            return of(AuthActions.loginFailure({ error }));
          })
        )
      ),
      tap(() => setLoading({ loading: false }))
    )
  );
  

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap(action =>
        this.authService.signup(action.email, action.password, action.username).pipe(
          map(user => AuthActions.signupSuccess({ user })),
          catchError(error => {
            console.error('Signup error:', error); // Log the error here
            return of(AuthActions.signupFailure({ error }));
          })
        )
      )
    )
  );
  
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => {
            console.error('Logout error:', error); // Log the error here
            return of(AuthActions.logoutFailure({ error }));
          })
        )
      )
    )
  );
  
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUser),
      mergeMap(() =>
        this.authService.getUser().pipe(
          map(user => AuthActions.getUserSuccess({ user })),
          catchError(error => {
            console.error('Get user error:', error); // Log the error here
            return of(AuthActions.getUserFailure({ error }));
          })
        )
      )
    )
  );
  
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      mergeMap(action =>
        this.authService.resetPassword(action.email).pipe(
          map(() => AuthActions.resetPasswordSuccess()),
          catchError(error => {
            console.error('Reset password error:', error); // Log the error here
            return of(AuthActions.resetPasswordFailure({ error }));
          })
        )
      )
    )
  );

  resetPasswordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPasswordSuccess),
      tap(async () => {
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
      })
    ),
    { dispatch: false }
  );

  continueWithGithub$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.continueWithGithub),
      mergeMap(() =>
        this.authService.continueWithGithub().pipe(
          map(user => AuthActions.continueWithGithubSuccess({ user })),
          catchError(error =>{
            console.log("Continue with Github",error)
            return of(AuthActions.continueWithGithubFailure({ error }));

          })
        )
      )
    )
  );
  
  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteAccount),
      switchMap(action =>
        this.authService.deleteAccount(action.password).pipe(
          map(() => AuthActions.deleteAccountSuccess()),
          catchError(error => of(AuthActions.deleteAccountFailure({ error })))
        )
      )
    )
  );
  
}
