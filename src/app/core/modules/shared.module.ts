import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { LazyImgDirective } from '../directives/lazy-img.directive';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [DateAgoPipe, LazyImgDirective],
  exports: [DateAgoPipe, LazyImgDirective],
})
export class SharedModule {}