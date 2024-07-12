import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {BackButtonData, ExceptionData} from './types';

@Component({
  selector: 'forbidden',
  template: `
    <exception [data]="data" [enableBack]="enableBack" [backBtn]="backBtn" (backEvent)="onBack()"></exception>
  `,
})
export class ForbiddenComponent implements OnInit {

  @Input() data: ExceptionData = {
    status: '403',
    title: '403',
    desc: 'Sorry, you are not authorized to access this page.'
  };
  @Input() enableBack: boolean = false;
  @Input() backBtn: BackButtonData = {
    type: 'primary',
    name: 'Back Home'
  };
  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.enableBack = this._route.snapshot.data?.['enableBack'] || false;
  }

  onBack() {
    window.location.href = '/';
  }
}
