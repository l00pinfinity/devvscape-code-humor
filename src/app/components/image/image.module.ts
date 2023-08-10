import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImageComponent } from './image.component';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule, NgxShimmerLoadingModule],
  declarations: [ImageComponent],
  exports: [ImageComponent]
})
export class ImageComponentModule {}
