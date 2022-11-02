import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';


import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { DateAgoPipe } from '../../core/pipe/date-ago.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ScrollingModule,
  ],
  declarations: [HomePage,DateAgoPipe]
})
export class HomePageModule {}
