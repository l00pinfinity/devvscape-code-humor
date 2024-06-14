import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthFormModule } from '../../auth-form/auth-form.module';

@NgModule({
    declarations: [LoginPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoginPageRoutingModule,
        AuthFormModule,
        TranslocoModule
    ],
})
export class LoginPageModule {}