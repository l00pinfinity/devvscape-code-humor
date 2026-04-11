import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomePageRoutingModule } from './welcome-routing.module';

import { WelcomePage } from './welcome.page';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthModule } from '../../auth.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomePageRoutingModule,
    TranslocoModule,
    AuthModule,
  ],
  declarations: [WelcomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WelcomePageModule {}
