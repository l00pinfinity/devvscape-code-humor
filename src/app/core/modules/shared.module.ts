import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { DateAgoPipe } from '../pipe/date-ago.pipe';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [DateAgoPipe],
  exports: [DateAgoPipe],
  entryComponents: [],
})
export class SharedModule {}
