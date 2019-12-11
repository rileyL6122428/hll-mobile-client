import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'new-track', loadChildren: './new-track/new-track.module#NewTrackPageModule' },
  { path:
    'create-track-confirmation',
    loadChildren: './create-track-confirmation/create-track-confirmation.module#CreateTrackConfirmationPageModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
