import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification } from 'src/app/core/interface/notification.interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private auth: Auth,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit() {
    this.getNotifications();
  }

  ionViewWillEnter() {
    this.getNotifications();
  }
  refresh(ev) {
    setTimeout(() => {
      this.getNotifications();
      ev.detail.complete();
    }, 3000);
  }

  async getNotifications() {
    const user = this.auth.currentUser;

    this.notifications = await this.notificationService.getNotifications(user.uid);
  }

  async markBatchAsRead() {
    const user = this.auth.currentUser;
    const notificationIds = this.notifications.map(notification => notification.id);

    if (notificationIds.length === 0) {
      return; // No notifications to mark as read
    }

    try {
      await this.notificationService.markBatchAsRead(user.uid, notificationIds);

      // Update the local state to mark notifications as read
      this.notifications.forEach(notification => {
        notification.isRead = true;
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }

  async notificationAction(notification: Notification) {
    const user = this.auth.currentUser;
    switch (notification.type) {
      case 'comment':
        await this.notificationService.markNotificationAsRead(user.uid, notification.id);
        this.router.navigate(['image', notification.imageId]);
        break;
      case 'login':
        break;
      case 'promotional':
        break;
      default:
        await this.notificationService.markNotificationAsRead(user.uid, notification.id);
        console.log('Unsupported notification type');
    }
  }

  async deleteNotification(notification: Notification) {
    const user = this.auth.currentUser;
    await this.notificationService.deleteNotification(user.uid, notification.id);
    this.getNotifications();
  }

}
