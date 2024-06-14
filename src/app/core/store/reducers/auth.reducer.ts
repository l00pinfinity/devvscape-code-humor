import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { User, UserCredential } from '@angular/fire/auth';
import { setLoading } from '../actions/auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: any;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.signup, AuthActions.logout, AuthActions.resetPassword, AuthActions.deleteAccount, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, AuthActions.signupSuccess, (state, { user }) => ({
    ...state,
    user: user.user,
    loading: false,
  })),
  on(AuthActions.logoutSuccess, state => ({
    ...state,
    user: null,
    loading: false,
  })),
  on(AuthActions.setLoading, (state, { loading }) => ({ ...state, loading })),
  on(AuthActions.getUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(AuthActions.resetPasswordSuccess, AuthActions.deleteAccountSuccess, state => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.loginFailure, AuthActions.signupFailure, AuthActions.logoutFailure, AuthActions.getUserFailure, AuthActions.resetPasswordFailure, AuthActions.deleteAccountFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.continueWithGithubSuccess, (state, { user }) => ({
    ...state,
    user: user.user,
    error: null,
  })),
  on(AuthActions.continueWithGithubFailure, (state, { error }) => ({
    ...state,
    user: null,
    error,
  }))
);
