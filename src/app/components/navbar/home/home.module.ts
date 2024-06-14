import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ImageModule } from "../../shared/components/image/image.module";
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
    declarations: [HomePage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        ImageModule,
        TranslocoModule
    ]
})
export class HomePageModule {}
