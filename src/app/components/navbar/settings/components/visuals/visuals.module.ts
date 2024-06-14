import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualsPageRoutingModule } from './visuals-routing.module';

import { VisualsPage } from './visuals.page';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualsPageRoutingModule,
    TranslocoModule
  ],
  declarations: [VisualsPage]
})
export class VisualsPageModule {}
