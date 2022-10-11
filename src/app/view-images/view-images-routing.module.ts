import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewImagesPage } from './view-images.page';

const routes: Routes = [
  {
    path: '',
    component: ViewImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewImagesPageRoutingModule {}
