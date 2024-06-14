import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualsPage } from './visuals.page';

const routes: Routes = [
  {
    path: '',
    component: VisualsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualsPageRoutingModule {}
