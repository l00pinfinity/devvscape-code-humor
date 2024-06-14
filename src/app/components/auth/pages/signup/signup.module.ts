import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthFormModule } from '../../auth-form/auth-form.module';

@NgModule({
    declarations: [SignupPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SignupPageRoutingModule,
        AuthFormModule,
        TranslocoModule
    ]
})
export class SignupPageModule {}
