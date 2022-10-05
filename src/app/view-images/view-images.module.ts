import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewImagesPage } from './view-images.page';

import { IonicModule } from '@ionic/angular';

import { ViewImagesPageRoutingModule } from './view-images-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewImagesPageRoutingModule
  ],
  declarations: [ViewImagesPage]
})
export class ViewImagesPageModule {}
