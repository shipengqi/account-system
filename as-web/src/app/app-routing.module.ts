import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BasicComponent} from './basic.component';

const routes: Routes = [
  {
    path: '',
    component: BasicComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
      },
    ]
  },
  // All exceptions and passport pages.
  // Moved from the Routes.children of the BasicComponent, in order to be displayed as a separate page.
  // And the app-root component needs to be changed to `<router-outlet></router-outlet>`
  {
    path: '',
    loadChildren: () => import('./core/passport/passport.module').then(m => m.PassportModule), data: { preload: true }
  },
  {
    path: 'exception',
    loadChildren: () => import('./core/exception/exception.module').then(m => m.ExceptionModule),
  },
  {
    path: '**',
    redirectTo: 'exception/404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
