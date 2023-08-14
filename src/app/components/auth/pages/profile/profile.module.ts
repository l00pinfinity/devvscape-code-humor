import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ProfileStore } from './profile.store';
import { ImageComponentModule } from '../../../image/image.module';
import { SharedModule } from 'src/app/core/modules/shared.module';

@NgModule({
  declarations: [ProfilePage],
  providers: [ProfileStore],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ImageComponentModule,
    SharedModule
  ],
})
export class ProfilePageModule {}
