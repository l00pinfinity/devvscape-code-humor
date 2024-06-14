import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { ImageDetailsComponent } from './image-details.component';
import { ImageDetailsRoutingModule } from './image-details-routing.module';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, ImageDetailsRoutingModule, SharedModule,TranslocoModule],
  declarations: [ImageDetailsComponent],
  exports: [ImageDetailsComponent]
})
export class ImageDetailsModule { }
