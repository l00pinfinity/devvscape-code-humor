import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from './auth-form.component';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthFormComponent],
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslocoModule],
  exports:[AuthFormComponent]
})
export class AuthFormModule { }
