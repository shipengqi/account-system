import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {ForbiddenComponent} from './forbidden.component';
import {NotFoundComponent} from './not-found.component';
import {ErrorComponent} from './error.component';

const routes: Routes = [
  {path: '403', component: ForbiddenComponent, data: {enableBack: true}},
  {path: '404', component: NotFoundComponent, data: {enableBack: true}},
  {path: '500', component: ErrorComponent, data: {enableBack: true}},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ExceptionRoutingModule {}
