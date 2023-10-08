import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageDetailsComponent } from './image-details.component';
import { ImageDetailsRoutingModule } from './image-details-routing.module';
import { SharedModule } from 'src/app/core/modules/shared.module';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, ImageDetailsRoutingModule, SharedModule],
  declarations: [ImageDetailsComponent],
  exports: [ImageDetailsComponent]
})
export class ImageDetailsComponentModule {}
