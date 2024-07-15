import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';

import {LayoutOptions} from './core/layout';

@Component({
  selector: 'app-layout-basic',
  template: `
    <app-layout [options]="options"
                [content]="contentTmpl">
      <app-layout-header-item direction="right">
        <app-header-user [showCenter]="false" [showLogout]="false" [showSettings]="false"></app-header-user>
      </app-layout-header-item>
      <ng-template #contentTmpl>
        <router-outlet></router-outlet>
      </ng-template>
    </app-layout>
  `,
})
export class BasicComponent implements OnInit {
  options: LayoutOptions = {
    logoText: '中辉运输',
    logoHidden: 'mobile',
    siderCollapsible: true,
    hideSider: true,
  };

  constructor(private _msg: NzMessageService) {}

  ngOnInit(): void {}
}
