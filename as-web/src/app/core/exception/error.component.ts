import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ExceptionData, BackButtonData} from './types';

@Component({
  selector: 'server-error',
  template: `
    <exception [data]="data" [enableBack]="enableBack" [backBtn]="backBtn" (backEvent)="onBack()"></exception>
  `,
})
export class ErrorComponent implements OnInit {

  @Input() data: ExceptionData = {
    status: '500',
    title: '500',
    desc: 'Sorry, there is an error on server.'
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
