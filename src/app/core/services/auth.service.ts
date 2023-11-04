import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { collection, deleteDoc, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { deleteUser, updateProfile } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userId: string;
  constructor(private auth: Auth, private firestore: Firestore) { }

  getUser(): Observable<User> {
    return authState(this.auth);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signup(fullName: string | null, email: string, password: string): Promise<User> {
    try {
      if (fullName === null) {
        fullName = 'devvscape_user'; // Set a default username
      }
      
      const newUserCredential: UserCredential =
        await createUserWithEmailAndPassword(this.auth, email, password);

      await updateProfile(newUserCredential.user, { displayName: fullName });

      const userReference = doc(
        this.firestore,
        `users/${newUserCredential.user.uid}`
      );

      await setDoc(userReference, { email, fullName }, { merge: true });
      return newUserCredential.user;
    } catch (error) {
      throw error;
    }
  }


  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  async closeAccount(): Promise<void> {
    const user = this.auth.currentUser;

    if (user) {
      const userId = user.uid;

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

      const notificationsCollection = collection(this.firestore, `users/${userId}/notifications`);
      const notificationsQuery = query(notificationsCollection);
      const notificationsSnapshot = await getDocs(notificationsQuery);

      for (const notificationDoc of notificationsSnapshot.docs) {
        const notificationId = notificationDoc.id;
        await deleteDoc(doc(notificationsCollection, notificationId));
      }

      const userDocRef = doc(this.firestore, `users/${userId}`); 
      await deleteDoc(userDocRef);

      await deleteUser(user);

      await this.logout();
    } else {
      throw new Error('User not authenticated');
    }
  }
}
