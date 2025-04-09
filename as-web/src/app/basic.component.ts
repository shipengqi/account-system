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
    <app-base-dialog [visible]="isCaptchaVisible">
<!--      <go-captcha-click
        [data]="captchaClickBasicData"
        [events]="captchaClickBasicEvents"
        [config]="captchaClickBasicConfig"
        #captchaClickBasicRef
      ></go-captcha-click>
      <br/>
      <go-captcha-slide
        [data]="captchaSlideData"
        [events]="captchaSlideEvents"
        [config]="captchaSlideConfig"
        #captchaSlideRef
      ></go-captcha-slide>
      <br/>-->
      <go-captcha-rotate
        [data]="captchaRotateData"
        [events]="captchaRotateEvents"
        [config]="captchaRotateConfig"
        #captchaRotateRef
      ></go-captcha-rotate>
    </app-base-dialog>
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
      this.onExperimentClick();
    },
    close: (): void => {
      this.isCaptchaVisible = false;
      console.log("close >>>>>>>");
    }
  }

  captchaSlideKey = '';
  captchaSlideData = {
    thumbX: 20,
    thumbY: 20,
    thumbWidth: 0,
    thumbHeight: 0,
    image: '',
    thumb: '',
  }

  captchaSlideConfig = {
    width: 300,
    height: 220,
  }

  captchaSlideEvents = {
    move: (x: number, y: number): void => {
      console.log("move >>>>>>>", x, y)
    },
    confirm: (point: any, reset: Function) => {
      this.confirmCaptchaSlideEvent(point, reset)
    },
    refresh: () => {
      this.requestCaptchaSlideData()
    },
    close: (): void => {
      console.log("close >>>>>>>")
    }
  }

  confirmCaptchaSlideEvent(point: any, reset: Function) {
    // Todo reset captcha
    this._cap.confirmSlideBasicData(point, this.captchaSlideKey).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  requestCaptchaSlideData(){
    // Todo clear
    // this.captchaSlideRef.clear && this.captchaSlideRef.clear()
    this._cap.getSlideBasic().subscribe({
      next: (res) => {
        this.captchaSlideData.thumbX = res.tile_x
        this.captchaSlideData.thumbY = res.tile_y
        this.captchaSlideData.thumbWidth = res.tile_width
        this.captchaSlideData.thumbHeight = res.tile_height
        this.captchaSlideData.image = res.image_base64
        this.captchaSlideData.thumb = res.tile_base64
        this.captchaSlideKey = res.key
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  captchaRotateKey = '';
  captchaRotateData = {
    image: '',
    thumb: '',
    thumbSize: 0,
  }

  captchaRotateEvents = {
    rotate: (angle: number): void => {
      console.log("rotate >>>>>>>", angle)
    },
    confirm: (dot: any, reset: Function) => {
      this.confirmRotateEvent(dot, reset)
    },
    refresh: () => {
      this.requestRotateData()
    },
    close: (): void => {
      console.log("close >>>>>>>")
    }
  }

  captchaRotateConfig = {
    width: 300,
    height: 220,
  }

  confirmRotateEvent(angle: any, reset: Function) {
    // Todo reset captcha
    this._cap.confirmRotateBasicData(angle, this.captchaRotateKey).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  requestRotateData(){
    // Todo clear
    // this.captchaRotateRef.clear && this.captchaRotateRef.clear()
    this._cap.getRotateBasic().subscribe({
      next: (res) => {
        this.captchaRotateData.image = res.image_base64
        this.captchaRotateData.thumb = res.thumb_base64
        this.captchaRotateKey = res.key
      },
      error: (err) => {
        console.log(err);
      }
    });
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
    this.isCaptchaVisible = true;
    // Todo clear
    // this.captchaClickBasicRef.clear && this.captchaClickBasicRef.clear()
    this._cap.getClickBasic().subscribe({
      next: (res) => {
        this.captchaClickBasicData.image = res.image_base64;
        this.captchaClickBasicData.thumb = res.thumb_base64;
        this.captchaClickBasicKey = res.key;
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.requestCaptchaSlideData();
    this.requestRotateData();
  }

  handleCaptchaCancel(): void {
    this.isCaptchaVisible = false;
  }

  confirmCaptchaClickBasicEvent(dot: any, reset: Function) {
    // Todo reset captcha
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
