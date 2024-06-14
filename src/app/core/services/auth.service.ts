import { Injectable } from '@angular/core';
import { Auth, EmailAuthProvider, GithubAuthProvider, User, UserCredential, authState, createUserWithEmailAndPassword, deleteUser, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Firestore, serverTimestamp, doc, setDoc, collection, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';

interface ErrorResponse {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore, private toastCtrl: ToastController) { }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError(error => this.handleError(error))
    );
  }

  signup(email: string, password: string, username: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        const user = userCredential.user;
        const avatarUrl = this.generateAvatarUrl(username);

        return from(updateProfile(user, { displayName: username, photoURL: avatarUrl })).pipe(
          switchMap(() => this.createUserProfile(user, username, avatarUrl)),
          map(() => userCredential),
          catchError(error => this.handleError(error))
        );
      }),
      catchError(error => this.handleError(error))
    );
  }

  generateAvatarUrl(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&format=svg`;
  }

  private createUserProfile(user: User, username: string, avatarUrl: string): Observable<void> {
    const userProfile = {
      uid: user.uid,
      email: user.email,
      username: username,
      profilePicture: avatarUrl,
      bio: '',
      location: '',
      website: '',
      githubUsername: '',
      twitterHandle: '',
      linkedinProfile: '',
      favoriteTechStack: [],
      interests: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      memesPosted: 0,
      eventsCreated: 0,
      gamesParticipated: 0,
      followers: 0,
      following: 0,
    };

    const userRef = doc(this.firestore, 'users', user.uid);

    return from(setDoc(userRef, userProfile)).pipe(
      catchError(error => this.handleError(error))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getUser(): Observable<User | null> {
    return authState(this.auth).pipe(
      catchError(error => this.handleError(error))
    );
  }

  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError(error => this.handleError(error))
    );
  }

  continueWithGithub(): Observable<UserCredential> {
    const provider = new GithubAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      catchError(error => this.handleError(error))
    );
  }

  reauthenticate(password: string): Observable<void> {
    const user = this.auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      return from(reauthenticateWithCredential(user, credential)).pipe(
        switchMap(() => of(undefined)),
        catchError(error => this.handleError(error))
      );
    } else {
      return throwError(() => new Error('No user is currently logged in.'));
    }
  }

  deleteAccount(password: string): Observable<void> {
    return this.reauthenticate(password).pipe(
      switchMap(async () => {
        const user = this.auth.currentUser;

        if (user) {
          const userId = user.uid;

          // Delete user's posts and related comments
          const postsCollection = collection(this.firestore, 'posts');
          const postsQuery = query(postsCollection, where('postedBy', '==', userId));
          const postsSnapshot = await getDocs(postsQuery);

          for (const postDoc of postsSnapshot.docs) {
            const postId = postDoc.id;
            const commentsCollection = collection(this.firestore, `posts/${postId}/comments`);
            const commentsQuery = query(commentsCollection, where('postedBy', '==', userId));
            const commentsSnapshot = await getDocs(commentsQuery);

            for (const commentDoc of commentsSnapshot.docs) {
              const commentId = commentDoc.id;
              await deleteDoc(doc(commentsCollection, commentId));
            }

            await deleteDoc(doc(postsCollection, postId));
          }

          // Delete user's notifications
          const notificationsCollection = collection(this.firestore, `users/${userId}/notifications`);
          const notificationsQuery = query(notificationsCollection);
          const notificationsSnapshot = await getDocs(notificationsQuery);

          for (const notificationDoc of notificationsSnapshot.docs) {
            const notificationId = notificationDoc.id;
            await deleteDoc(doc(notificationsCollection, notificationId));
          }

          // Delete user document
          const userDocRef = doc(this.firestore, `users/${userId}`);
          await deleteDoc(userDocRef);

          // Delete user authentication
          await deleteUser(user);

          // Logout the user
          await this.logout();
        } else {
          throw new Error('No user is currently logged in.');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: ErrorResponse): Observable<never> {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Account with this email address is already in use. Please login.',
      'auth/missing-password': 'Please enter a password to continue.',
      'auth/invalid-email': 'Please enter a valid email address to continue.',
      'auth/invalid-credential': 'Wrong password. Please try again.',
      'auth/popup-closed-by-user': 'Popup was closed by the user. Please try again.',
      'auth/popup-blocked': 'Popup window was blocked by your browser. Please allow popups and try again.',
      'auth/cancelled-popup-request': 'Popup request was cancelled. Please try again.',
      'auth/network-request-failed': 'Network request failed. Please check your internet connection and try again.',
      'auth/user-not-found': 'User not found. Please check your email.',
      'auth/wrong-password': 'Wrong password. Please try again.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials. Please use the appropriate sign-in method.',
      'auth/too-many-requests': 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
      'auth/requires-recent-login': 'To delete account requires recent login, login and try again'
    };

    const errorMessage = errorMessages[error.code] || error.message;

    console.error('Error message:', errorMessage);

    this.toastCtrl.create({
      message: errorMessage,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    }).then(toast => toast.present());

    return throwError(() => errorMessage);
  }
}
