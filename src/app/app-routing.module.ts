import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: 'images',
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'image/:id',
    loadChildren: () => import('./components/image-details/image-details.module').then((m) => m.ImageDetailsComponentModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./components/auth/pages/profile/profile.module').then(
        (m) => m.ProfilePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'images',
    pathMatch: 'full',
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./components/notification/notification.module').then(
        (m) => m.NotificationPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/auth/pages/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./components/auth/pages/signup/signup.module').then(
        (m) => m.SignupPageModule
      ),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import(
        './components/auth/pages/reset-password/reset-password.module'
      ).then((m) => m.ResetPasswordPageModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./components/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
