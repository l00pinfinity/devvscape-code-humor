import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameDetailsPage } from './game-details.page';

const routes: Routes = [
  {
    path: '',
    component: GameDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameDetailsPageRoutingModule {}
