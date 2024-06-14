import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsPageRoutingModule } from './notifications-routing.module';

import { NotificationsPage } from './notifications.page';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
    declarations: [NotificationsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NotificationsPageRoutingModule,
        SharedModule,
        TranslocoModule
    ]
})
export class NotificationsPageModule {}
