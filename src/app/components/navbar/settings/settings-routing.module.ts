import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'notifications',
    loadChildren: () => import('./components/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'visuals',
    loadChildren: () => import('./components/visuals/visuals.module').then( m => m.VisualsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
