import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

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
import {ProjetsComponent} from "./projets/projets.component";
import {PagesComponent} from "./pages.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    OrdersComponent,
    ExpenditureComponent,
    VehiclesComponent,
    DriversComponent,
    ProjetsComponent
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
    NzInputNumberModule
  ]
})
export class PagesModule {}
