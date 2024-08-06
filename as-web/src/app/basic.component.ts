import {Component, OnInit} from '@angular/core';

import {LayoutOptions} from './core/layout';
import {ConfigService} from "./shared/services/config.service";
import moment from "moment";

@Component({
  selector: 'app-layout-basic',
  template: `
    <app-layout [options]="options"
                [content]="contentTmpl">
      <app-layout-header-item direction="right">
        <app-header-help [version]="buildVersion" [date]="buildDate" [loading]="loading"></app-header-help>
      </app-layout-header-item>
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
    logoExpanded: './assets/full-logo-white-mid.png',
    logoCollapsed: './assets/logo-white.png',
    logoHidden: 'mobile',
    siderCollapsible: true,
    hideSider: true,
  };

  loading = true;
  buildVersion = 'Dev';
  buildDate = moment().format('M/D/YYYY');

  constructor(private _config: ConfigService) {}

  ngOnInit(): void {
    this.loading = true;
    this._config.getBuildInfo().subscribe({
      next: (res) => {
        this.buildVersion = res.version;
        this.buildDate = moment(res.time).format('M/D/YYYY');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    })
  }
}
