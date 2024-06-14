import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule, SharedModule, TranslocoModule],
  declarations: [ImageComponent],
  exports: [ImageComponent]
})
export class ImageModule { }
