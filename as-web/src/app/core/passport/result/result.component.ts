import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzButtonType} from 'ng-zorro-antd/button/button.component';

export interface ResultData {
  title: string;
  desc: string;
}

export interface ButtonData {
  type: NzButtonType;
  name: string;
}

@Component({
  selector: 'passport-result',
  template: `
    <div class="container">
      <div class="header"></div>
      <div class="wrap">
        <div class="top">
          <div class="head">
            <img class="logo" src="https://ng-alain.surge.sh/assets/logo-color.svg" alt=""/>
            <span class="title">IDM</span>
          </div>
        </div>
        <nz-result [nzIcon]="emptyIcon"
                   [nzTitle]="data.title | translate"
                   [nzSubTitle]="data.desc | translate">
          <ng-template #emptyIcon></ng-template>
          <div nz-result-extra>
            <button nz-button [nzType]="button.type" (click)="btnClickEvent.emit()"> {{ button.name | translate }} </button>
          </div>
        </nz-result>
      </div>
    </div>
  `,
  styleUrls: ['./result.component.less']
})
export class ResultComponent implements OnInit {

  @Input() data: ResultData = {
    title: 'passport.result-common-title',
    desc: 'passport.result-common-desc'
  };
  @Input() button: ButtonData = {
    type: 'primary',
    name: 'passport.login.title'
  };
  @Output() btnClickEvent = new EventEmitter();
  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this._route.snapshot.data) {
      const routeData = this._route.snapshot.data;
      if (routeData['title']) {
        this.data.title = routeData['title'];
      }
      if (routeData['desc']) {
        this.data.title = routeData['desc'];
      }
      if (routeData['btnType']) {
        this.data.title = routeData['btnType'];
      }
      if (routeData['btnName']) {
        this.data.title = routeData['btnName'];
      }
    }
  }

}
