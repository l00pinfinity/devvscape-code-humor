import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../core/services/notification.service';
import { Auth } from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  count: number = 0;
  private onResumeSubscription: Subscription | undefined;

  constructor(
    private auth: Auth,
    private notificationService: NotificationService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.updateNotificationCount();
    this.onResumeSubscription = this.platform.resume.subscribe(() => {
      this.updateNotificationCount();
    });
  }

  ionViewWillEnter() {
    this.updateNotificationCount();
  }

  ngOnDestroy() {
    if (this.onResumeSubscription) {
      this.onResumeSubscription.unsubscribe();
    }
  }

  async updateNotificationCount() {
    const userUid = this.auth.currentUser?.uid;
    if (userUid) {
      try {
        const count = await this.notificationService.getUnreadNotificationCount(userUid);
        this.count = count;
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    }
  }

}
