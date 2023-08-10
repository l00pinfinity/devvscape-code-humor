import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewImagePage } from './view-image.page';

const routes: Routes = [
  {
    path: '',
    component: ViewImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewImagePageRoutingModule {}
