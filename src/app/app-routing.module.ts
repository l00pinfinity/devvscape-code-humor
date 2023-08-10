import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomePageModule),
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
    redirectTo: 'home',
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
