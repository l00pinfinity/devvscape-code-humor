import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Notification } from 'src/app/core/models/data/notification.interface';
import { AdMobService } from 'src/app/core/services/ad-mob.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: Notification[] = [];

  constructor(
    private auth: Auth,
    private notificationService: NotificationService,
    private router: Router,
    private adMobService: AdMobService,
  ) { }

  ngOnInit() {
    this.getNotifications();
  }

  ionViewWillEnter() {
    this.getNotifications();
    this.adMobService.showBannerAd('notification-banner-ad','ca-app-pub-6424707922606590/1224657880');

  }

  refresh(ev: any) {
    setTimeout(() => {
      this.getNotifications();
      ev.detail.complete();
    }, 3000);
  }

  async getNotifications() {
    const user = this.auth.currentUser;
    if (user) {
      this.notifications = await this.notificationService.getNotifications(user.uid);
    } else {
      console.error('No authenticated user found');
    }
  }

  async markBatchAsRead() {
    const user = this.auth.currentUser;
    if (user) {
      const notificationIds = this.notifications
        .map((notification) => notification.id)
        .filter((id): id is string => id !== undefined); // Filter out undefined IDs

      if (notificationIds.length === 0) {
        return; // No notifications to mark as read
      }

      try {
        await this.notificationService.markBatchAsRead(user.uid, notificationIds);

        // Update the local state to mark notifications as read
        this.notifications.forEach((notification) => {
          notification.isRead = true;
        });
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    } else {
      console.error('No authenticated user found');
    }
  }

  async notificationAction(notification: Notification) {
    const user = this.auth.currentUser;
    if (user) {
      if (notification.id) {
        switch (notification.type) {
          case 'comment':
            if (notification.imageId) {
              await this.notificationService.markNotificationAsRead(user.uid, notification.id);
              this.router.navigate(['image', notification.imageId]);
            } else {
              console.error('Image ID is undefined for comment notification');
            }
            break;
          case 'login':
            break;
          case 'promotional':
            break;
          case 'newUser':
            await this.notificationService.markNotificationAsRead(user.uid, notification.id);
            this.getNotifications();
            // Add Welcome page to redirect users to
            break;
          default:
            await this.notificationService.markNotificationAsRead(user.uid, notification.id);
          // console.log('Unsupported notification type');
        }
      } else {
        console.error('Notification ID is undefined');
      }
    } else {
      console.error('No authenticated user found');
    }
  }

  async deleteNotification(notification: Notification) {
    const user = this.auth.currentUser;
    if (user) {
      if (notification.id) {
        await this.notificationService.deleteNotification(user.uid, notification.id);
        this.getNotifications();
      } else {
        console.error('Notification ID is undefined');
      }
    } else {
      console.error('No authenticated user found');
    }
  }
}
