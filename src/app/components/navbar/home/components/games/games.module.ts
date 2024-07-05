import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamesPageRoutingModule } from './games-routing.module';

import { GamesPage } from './games.page';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamesPageRoutingModule,
    TranslocoModule
  ],
  declarations: [GamesPage]
})
export class GamesPageModule {}
