import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { AuthModule } from '../../../../core/modules/auth.module';

@NgModule({
    declarations: [SignupPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SignupPageRoutingModule,
        AuthModule
    ]
})
export class SignupPageModule {}
