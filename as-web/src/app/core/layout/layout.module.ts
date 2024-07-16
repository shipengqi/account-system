import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';

import {LayoutComponent} from './layout.component';
import {LayoutHeaderComponent} from './layout-header/layout-header.component';
import {LayoutHeaderItemComponent} from './layout-header/layout-header-item/layout-header-item.component';
import {LayoutSiderComponent} from './layout-sider/layout-sider.component';
import {HeaderUserComponent} from './widgets';
import {HeaderNavComponent} from './widgets';
import {HeaderNavItemComponent} from './widgets';
import {HeaderNotifyComponent} from './widgets';
import {HeaderNotifyItemComponent} from './widgets';
import {ToolbarButtonComponent} from './widgets';
import {ToolbarSearchComponent} from './widgets';
import {ToolbarComponent} from './widgets';
import {ToolbarItemComponent} from './widgets'

@NgModule({
  declarations: [
    LayoutComponent,
    LayoutHeaderComponent,
    LayoutHeaderItemComponent,
    LayoutSiderComponent,
    HeaderUserComponent,
    HeaderNavComponent,
    HeaderNavItemComponent,
    HeaderNotifyComponent,
    HeaderNotifyItemComponent,
    ToolbarButtonComponent,
    ToolbarSearchComponent,
    ToolbarComponent,
    ToolbarItemComponent
  ],
  exports: [
    LayoutComponent,
    LayoutHeaderComponent,
    LayoutHeaderItemComponent,
    LayoutSiderComponent,
    HeaderNavComponent,
    HeaderNavItemComponent,
    HeaderUserComponent,
    HeaderNotifyComponent,
    ToolbarButtonComponent,
    ToolbarSearchComponent,
    ToolbarComponent,
    ToolbarItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    NzAutocompleteModule,
    NzDropDownModule,
    NzAvatarModule,
    NzBadgeModule,
    NzCardModule,
    NzSpinModule,
    NzGridModule,
    NzIconModule,
    NzTagModule,
    NzToolTipModule,
    NzInputModule,
    NzButtonModule,
  ]
})
export class LayoutModule {}
