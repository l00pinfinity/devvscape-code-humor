import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  writeBatch,
} from '@angular/fire/firestore';
import {
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Notification } from '../models/data/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private firestore: Firestore,) { }

  async addNotification(userId: string, notification: Notification) {
    try {
      const userNotificationsCollection = collection(this.firestore, `users/${userId}/notifications`);
      const notificationDoc = { ...notification, createdAt: serverTimestamp() };
      await addDoc(userNotificationsCollection, notificationDoc);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(collection(this.firestore, `users/${userId}/notifications`),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((document) => {
        const data = document.data() as Notification;
        const id = document.id;
        return { id, ...data };
      });
    } catch (error) {
      throw new Error('Unable to fetch image posts');
    }
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(this.firestore, `users/${userId}/notifications/${notificationId}`);

      // Delete the notification document
      await deleteDoc(notificationRef);
    } catch (error) {
      throw new Error('Unable to delete the notification');
    }
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(this.firestore, `users/${userId}/notifications/${notificationId}`);

      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
      throw new Error('Unable to mark the notification as read');
    }
  }

  async markBatchAsRead(userId: string, notificationIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(this.firestore);

      const notificationRefs = notificationIds.map((notificationId) =>
        doc(this.firestore, `users/${userId}/notifications/${notificationId}`)
      );

      notificationRefs.forEach((notificationRef) => {
        batch.update(notificationRef, { isRead: true });
      });

      await batch.commit();
    } catch (error) {
      throw new Error('Unable to mark notifications as read');
    }
  }

}