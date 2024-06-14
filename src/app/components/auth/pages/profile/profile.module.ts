import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  declarations: [ProfilePage],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,
    TranslocoModule
  ],
})
export class ProfilePageModule {}