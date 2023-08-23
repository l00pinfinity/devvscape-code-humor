import { Injectable } from '@angular/core';
import {
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  docData,
} from '@angular/fire/firestore';
import {
  User,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  updatePassword,
} from '@angular/fire/auth';
import {
  map,
  catchError,
  switchMap,
  tap,
  concatMap,
  first,
} from 'rxjs/operators';
import { EMPTY, forkJoin, from, Observable } from 'rxjs';
import { UserProfile } from '../interface/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  currentUser: User;
  constructor(private firestore: Firestore, private authService: AuthService) {}

  getUserProfileReference(): Observable<DocumentReference<DocumentData>> {
    return this.authService.getUser().pipe(
      map((user) => {
        this.currentUser = user;
        return doc(this.firestore, `users/${user.uid}`);
      }),
      catchError(() => EMPTY)
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.getUserProfileReference().pipe(
      switchMap(
        (userProfileReference) =>
          docData(userProfileReference) as Observable<UserProfile>
      ),
      catchError(() => EMPTY)
    );
  }

  updateName(fullName: string): Observable<DocumentReference<DocumentData>> {
    return this.getUserProfileReference().pipe(
      tap({
        next: (userProfileReference) =>
          setDoc(userProfileReference, { fullName }, { merge: true }),
        error: (error) => console.error(error),
      }),
      catchError(() => EMPTY)
    );
  }

  updateEmail(newEmail: string, password: string): Observable<unknown> {
    return forkJoin([
      this.getUserProfile().pipe(first()),
      this.authService.getUser().pipe(first()),
      this.getUserProfileReference().pipe(first()),
    ]).pipe(
      concatMap(([userProfile, user, userProfileReference]) => {
        const credential = EmailAuthProvider.credential(
          userProfile.email,
          password
        );
        return from(reauthenticateWithCredential(user, credential)).pipe(
          tap({
            next: () =>
              from(
                updateEmail(user, newEmail).then(() =>
                  setDoc(
                    userProfileReference,
                    { email: newEmail },
                    { merge: true }
                  )
                )
              ),
            error: (error) => console.error(error),
          })
        );
      })
    );
  }

  updatePassword(
    newPassword: string,
    oldPassword: string
  ): Observable<unknown> {
    return forkJoin([
      this.getUserProfile().pipe(first()),
      this.authService.getUser().pipe(first()),
    ]).pipe(
      concatMap(([userProfile, user]) => {
        const credential = EmailAuthProvider.credential(
          userProfile.email,
          oldPassword
        );
        return from(reauthenticateWithCredential(user, credential)).pipe(
          tap({
            next: () => from(updatePassword(user, newPassword)),
            error: (error) => console.error(error),
          })
        );
      })
    );
  }

  closeAccount(password: string): Observable<unknown> {
    return forkJoin([
      this.getUserProfile().pipe(first()),
      this.authService.getUser().pipe(first()),
    ]).pipe(
      concatMap(([userProfile, user]) => {
        const credential = EmailAuthProvider.credential(
          userProfile.email,
          password
        );
        return from(reauthenticateWithCredential(user, credential)).pipe(
          switchMap(() =>
             from(user.delete()).pipe(
              concatMap(() =>
                 this.getUserProfileReference().pipe(
                  switchMap((userProfileReference) => setDoc(userProfileReference, { deleted: true }, { merge: true }))
                )
              ),
              catchError((error) => {
                console.error('Error deleting account:', error);
                throw error;
              })
            )
          ),
          catchError((error) => {
            console.error('Error reauthenticating:', error);
            throw error;
          })
        );
      })
    );
  }
}
