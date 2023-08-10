import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ProfileService } from 'src/app/core/services/profile.service';

export interface ProfileState {
  email: string;
  fullName: string;
}

@Injectable()
export class ProfileStore extends ComponentStore<ProfileState> {
  constructor(private readonly profileService: ProfileService) {
    super({ email: '', fullName: '' });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly userProfile$: Observable<ProfileState> = this.select(
    (state) => state
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly updateEmail = this.updater((state, email: string) => ({
    ...state,
    email,
  }));

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly updateFullName = this.updater((state, fullName: string) => ({
    ...state,
    fullName,
  }));

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly updateUserName = this.effect((fullName$: Observable<string>) =>
    fullName$.pipe(
      switchMap((fullName) =>
        this.profileService.updateName(fullName).pipe(
          tap({
            next: () => this.updateFullName(fullName),
            error: (e) => console.log(e),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly updateUserEmail = this.effect(
    (credential$: Observable<{ email: string; password: string }>) =>
      credential$.pipe(
        switchMap(({ email, password }) =>
          this.profileService.updateEmail(email, password).pipe(
            tap({
              next: () => this.updateEmail(email),
              error: (e) => console.log(e),
            }),
            catchError(() => EMPTY)
          )
        )
      )
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly updateUserPassword = this.effect(
    (passwords$: Observable<{ newPassword: string; oldPassword: string }>) =>
      passwords$.pipe(
        switchMap(({ newPassword, oldPassword }) =>
          this.profileService.updatePassword(newPassword, oldPassword).pipe(
            tap({
              next: () => console.log('Updated Passwords'),
              error: (e) => console.log(e),
            }),
            catchError(() => EMPTY)
          )
        )
      )
  );
}
