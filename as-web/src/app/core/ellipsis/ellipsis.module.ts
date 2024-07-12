import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NzToolTipModule} from 'ng-zorro-antd/tooltip';

import {EllipsisComponent} from './ellipsis.component';


@NgModule({
  declarations: [
    EllipsisComponent
  ],
  imports: [
    CommonModule,
    NzToolTipModule
  ],
  exports: [
    EllipsisComponent
  ]
})
export class EllipsisModule {}
