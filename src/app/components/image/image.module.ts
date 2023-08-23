import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImageComponent } from './image.component';
import { SharedModule } from 'src/app/core/modules/shared.module';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule, SharedModule],
  declarations: [ImageComponent],
  exports: [ImageComponent]
})
export class ImageComponentModule {}
