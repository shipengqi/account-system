import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {NzCardModule} from 'ng-zorro-antd/card';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {TranslateModule} from '@ngx-translate/core';

import {ContentToolbarComponent} from './components/content-toolbar/content-toolbar.component';
import {ContentHeaderComponent} from './components/content-header/content-header.component';
import {ContentBodyComponent} from './components/content-body/content-body.component';
import {EllipsisModule} from '../core/ellipsis';

@NgModule({
  imports: [
    NzCardModule,
    NzAvatarModule,
    RouterModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    CommonModule,
    NzGridModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    TranslateModule,
    NzDropDownModule,
    EllipsisModule,
  ],
  exports: [
    ContentToolbarComponent,
    ContentHeaderComponent,
    ContentBodyComponent,
  ],
  declarations: [
    ContentToolbarComponent,
    ContentHeaderComponent,
    ContentBodyComponent,
  ]
})
export class SharedModule {}
