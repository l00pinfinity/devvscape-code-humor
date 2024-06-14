import { Injectable } from '@angular/core';
import {
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
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
import { map, catchError, switchMap, concatMap, first } from 'rxjs/operators';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { UserProfile } from '../models/data/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  currentUser: User | null = null;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  getUserProfileReference(): Observable<DocumentReference<DocumentData>> {
    return this.authService.getUser().pipe(
      switchMap((user) => {
        if (user) {
          this.currentUser = user;
          return of(doc(this.firestore, `users/${user.uid}`));
        } else {
          return EMPTY;
        }
      }),
      catchError(() => EMPTY)
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.getUserProfileReference().pipe(
      switchMap((userProfileReference) =>
        docData(userProfileReference) as Observable<UserProfile>
      ),
      catchError(() => EMPTY)
    );
  }

  updateName(fullName: string): Observable<void> {
    return this.getUserProfileReference().pipe(
      concatMap((userProfileReference) =>
        from(setDoc(userProfileReference, { fullName }, { merge: true }))
      ),
      catchError((error) => {
        console.error('Error updating name:', error);
        return EMPTY;
      })
    );
  }

  updateEmail(newEmail: string, password: string): Observable<void> {
    return forkJoin([
      this.getUserProfile().pipe(first()),
      this.authService.getUser().pipe(first()),
      this.getUserProfileReference().pipe(first()),
    ]).pipe(
      concatMap(([userProfile, user, userProfileReference]) => {
        if (user) {
          const credential = EmailAuthProvider.credential(
            userProfile.email,
            password
          );
          return from(reauthenticateWithCredential(user, credential)).pipe(
            switchMap(() =>
              from(updateEmail(user, newEmail)).pipe(
                concatMap(() =>
                  from(
                    setDoc(
                      userProfileReference,
                      { email: newEmail },
                      { merge: true }
                    )
                  )
                )
              )
            ),
            catchError((error) => {
              console.error('Error updating email:', error);
              throw error;
            })
          );
        } else {
          return EMPTY;
        }
      })
    );
  }

  updatePassword(newPassword: string, oldPassword: string): Observable<void> {
    return forkJoin([
      this.getUserProfile().pipe(first()),
      this.authService.getUser().pipe(first()),
    ]).pipe(
      concatMap(([userProfile, user]) => {
        if (user) {
          const credential = EmailAuthProvider.credential(
            userProfile.email,
            oldPassword
          );
          return from(reauthenticateWithCredential(user, credential)).pipe(
            switchMap(() =>
              from(updatePassword(user, newPassword))
            ),
            catchError((error) => {
              console.error('Error updating password:', error);
              throw error;
            })
          );
        } else {
          return EMPTY;
        }
      })
    );
  }

  closeAccount(password: string): Observable<void> {
    return forkJoin([
      this.getUserProfile().pipe(first()),
      this.authService.getUser().pipe(first()),
    ]).pipe(
      concatMap(([userProfile, user]) => {
        if (user) {
          const credential = EmailAuthProvider.credential(
            userProfile.email,
            password
          );
          return from(reauthenticateWithCredential(user, credential)).pipe(
            switchMap(() =>
              from(user.delete()).pipe(
                concatMap(() =>
                  this.getUserProfileReference().pipe(
                    concatMap((userProfileReference) =>
                      from(
                        setDoc(
                          userProfileReference,
                          { deleted: true },
                          { merge: true }
                        )
                      )
                    )
                  )
                )
              )
            ),
            catchError((error) => {
              console.error('Error closing account:', error);
              throw error;
            })
          );
        } else {
          return EMPTY;
        }
      })
    );
  }
}
