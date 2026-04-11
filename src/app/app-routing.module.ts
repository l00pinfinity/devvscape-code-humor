import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/auth/pages/login/login.module').then(
        m => m.LoginPageModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./components/auth/pages/signup/signup.module').then(
        m => m.SignupPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./components/auth/pages/profile/profile.module').then(
        m => m.ProfilePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'image/:id',
    loadChildren: () =>
      import(
        './components/shared/components/image-details/image-details.module'
      ).then(m => m.ImageDetailsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import(
        './components/auth/pages/reset-password/reset-password.module'
      ).then(m => m.ResetPasswordPageModule),
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./components/auth/pages/welcome/welcome.module').then(
        m => m.WelcomePageModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
