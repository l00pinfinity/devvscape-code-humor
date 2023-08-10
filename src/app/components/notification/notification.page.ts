import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notifications: any[] = [];

  constructor() {}

  ngOnInit() {
    this.notifications = [];
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  markAsRead() {
    for (const notification of this.notifications) {
      notification.read = true;
    }
  }
}
