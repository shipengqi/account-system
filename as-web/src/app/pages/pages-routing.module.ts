import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from "./dashboard/dashboard.component";
import {OrdersComponent} from "./orders/orders.component";
import {ExpenditureComponent} from "./expenditure/expenditure.component";
import {VehiclesComponent} from "./vehicles/vehicles.component";
import {DriversComponent} from "./drivers/drivers.component";
import {ProjectsComponent} from "./projects/projects.component";
import {PagesComponent} from "./pages.component";

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'expenditure',
        component: ExpenditureComponent,
      },
      {
        path: 'vehicles',
        component: VehiclesComponent,
      },
      {
        path: 'drivers',
        component: DriversComponent,
      },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      // All embedded exceptions pages.
      {
        path: 'exception',
        loadChildren: () => import('../core/exception/exception.module').then(m => m.ExceptionModule)
      },
      {
        path: '**', redirectTo: 'exception/404'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PagesRoutingModule {}
