import {Component, OnInit} from '@angular/core';

import {LayoutOptions} from './core/layout';
import {ConfigService} from "./shared/services/config.service";
import {CaptchaService} from './shared/services/captcha.service';
import moment from "moment";

@Component({
  selector: 'app-layout-basic',
  template: `
    <app-layout [options]="options"
                [content]="contentTmpl">
      <app-layout-header-item direction="right">
        <app-toolbar-btn icon="experiment" (clickEvent)="onExperimentClick()"></app-toolbar-btn>
      </app-layout-header-item>
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
    <nz-modal [(nzVisible)]="isCaptchaVisible" nzTitle="Captcha" (nzOnCancel)="handleCaptchaCancel()" (nzOnOk)="handleCaptchaCancel()">
      <ng-container *nzModalContent>
        <go-captcha-click
          [data]="captchaClickBasicData"
          [events]="captchaClickBasicEvents"
          [config]="captchaClickBasicConfig"
          #captchaClickBasicRef
        ></go-captcha-click>
      </ng-container>
    </nz-modal>
  `,
})
export class BasicComponent implements OnInit {
  isCaptchaVisible = false;
  captchaClickBasicKey = '';
  captchaClickBasicData = {
    image: '',
    thumb: '',
  }
  captchaClickBasicConfig = {
    width: 300,
    height: 220,
  }
  captchaClickBasicEvents = {
    click: (x: number, y: number): void => {
      console.log("click >>>>>>>", x, y);
    },
    confirm: (dot: any, reset: Function) => {
      console.log("confirm >>>>>>>");
      this.confirmCaptchaClickBasicEvent(dot, reset);
    },
    refresh: () => {
      console.log("refresh >>>>>>>");
    },
    close: (): void => {
      this.isCaptchaVisible = false;
      console.log("close >>>>>>>");
    }
  }

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

  constructor(
    private _config: ConfigService,
    private _cap: CaptchaService
  ) {}

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

  onExperimentClick(): void {
    this._cap.getClickBasic().subscribe({
      next: (res) => {
        this.captchaClickBasicData.image = res.image_base64;
        this.captchaClickBasicData.thumb = res.thumb_base64;
        this.captchaClickBasicKey = res.key;
        this.isCaptchaVisible = true;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleCaptchaCancel(): void {
    this.isCaptchaVisible = false;
  }

  confirmCaptchaClickBasicEvent(dot: any, reset: Function) {
    this._cap.confirmClickBasicData(dot, this.captchaClickBasicKey).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
