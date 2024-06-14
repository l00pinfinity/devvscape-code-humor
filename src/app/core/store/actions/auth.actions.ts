import { createAction, props } from '@ngrx/store';
import { User, UserCredential } from '@angular/fire/auth';
import { ErrorResponse } from '../../models/data/firebase.interface';

export const login = createAction('[Auth] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: UserCredential }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());
export const setLoading = createAction('[Auth] Set Loading', props<{ loading: boolean }>());

export const signup = createAction('[Auth] Signup', props<{ email: string, password: string, username: string }>());
export const signupSuccess = createAction('[Auth] Signup Success', props<{ user: UserCredential }>());
export const signupFailure = createAction('[Auth] Signup Failure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());

export const getUser = createAction('[Auth] Get User');
export const getUserSuccess = createAction('[Auth] Get User Success', props<{ user: User | null }>());
export const getUserFailure = createAction('[Auth] Get User Failure', props<{ error: any }>());

export const resetPassword = createAction('[Auth] Reset Password', props<{ email: string }>());
export const resetPasswordSuccess = createAction('[Auth] Reset Password Success');
export const resetPasswordFailure = createAction('[Auth] Reset Password Failure', props<{ error: any }>());

export const continueWithGithub = createAction('[Auth] Continue With Github');
export const continueWithGithubSuccess = createAction('[Auth] Continue With Github Success', props<{ user: UserCredential }>());
export const continueWithGithubFailure = createAction('[Auth] Continue With Github Failure', props<{ error: any }>());

export const deleteAccount = createAction('[Auth] Delete Account', props<{ password: string }>());
export const deleteAccountSuccess = createAction('[Auth] Delete Account Success');
export const deleteAccountFailure = createAction('[Auth] Delete Account Failure', props<{ error: ErrorResponse }>());
