import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NzCardModule} from "ng-zorro-antd/card";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzOutletModule} from "ng-zorro-antd/core/outlet";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";

import {ChartCardComponent} from './card/card.component';
import {TrendComponent} from "./trend/trend.component";


@NgModule({
  declarations: [
    ChartCardComponent,
    TrendComponent,
  ],
  imports: [
    CommonModule,
    NzCardModule,
    NzSpinModule,
    NzOutletModule,
    NzIconModule,
    NzSkeletonModule
  ],
  exports: [
    ChartCardComponent,
    TrendComponent,
  ]
})
export class ChartModule {}
