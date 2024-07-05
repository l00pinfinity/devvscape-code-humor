import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'events',
    loadChildren: () => import('./components/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./components/news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'games',
    loadChildren: () => import('./components/games/games.module').then( m => m.GamesPageModule)
  },
  {
    path: 'game-details',
    loadChildren: () => import('./components/game-details/game-details.module').then( m => m.GameDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
