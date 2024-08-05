import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {TranslateModule} from '@ngx-translate/core';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {G2BarModule} from "@delon/chart/bar";
import {G2TimelineModule} from "@delon/chart/timeline";
import {G2CardModule} from "@delon/chart/card";
import {G2PieModule} from "@delon/chart/pie";
import {TrendModule} from "@delon/chart/trend";
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzBackTopModule} from "ng-zorro-antd/back-top";

import {LayoutModule} from '../core/layout';
import {ExceptionModule} from '../core/exception';
import {SharedModule} from '../shared/shared.module';
import {DownFileModule} from '../core/down-file';
import {PagesRoutingModule} from './pages-routing.module';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {OrdersComponent} from "./orders/orders.component";
import {ExpenditureComponent} from "./expenditure/expenditure.component";
import {VehiclesComponent} from "./vehicles/vehicles.component";
import {DriversComponent} from "./drivers/drivers.component";
import {ProjectsComponent} from "./projects/projects.component";
import {PagesComponent} from "./pages.component";
import {TimelineComponent} from "./dashboard/timeline/timeline.component";


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    OrdersComponent,
    ExpenditureComponent,
    VehiclesComponent,
    DriversComponent,
    ProjectsComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TranslateModule,
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputModule,
    NzIconModule,
    NzCardModule,
    NzListModule,
    NzAvatarModule,
    NzTableModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzTypographyModule,
    NzFormModule,
    NzToolTipModule,
    NzModalModule,
    NzUploadModule,
    NzButtonModule,
    LayoutModule,
    SharedModule,
    ExceptionModule,
    DownFileModule,
    NzSelectModule,
    NzDividerModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    NzSpinModule,
    FormsModule,
    NzTabsModule,
    G2CardModule,
    TrendModule,
    G2BarModule,
    G2TimelineModule,
    G2PieModule,
    NzEmptyModule,
    NzBackTopModule
  ]
})
export class PagesModule {}
