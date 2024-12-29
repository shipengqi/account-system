import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {NzResultModule} from 'ng-zorro-antd/result';
import {NzButtonModule} from 'ng-zorro-antd/button';

import {NotFoundComponent} from './not-found.component';
import {ForbiddenComponent} from './forbidden.component';
import {ErrorComponent} from './error.component';
import {ExceptionComponent} from './exception.component';
import {ExceptionRoutingModule} from './exception-routing.moudle';

@NgModule({
  declarations: [
    ExceptionComponent,
    NotFoundComponent,
    ForbiddenComponent,
    ErrorComponent
  ],
  exports: [
    ExceptionComponent,
    NotFoundComponent,
    ForbiddenComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    NzResultModule,
    NzButtonModule,
    TranslateModule,
    ExceptionRoutingModule,
  ]
})
export class ExceptionModule {}
