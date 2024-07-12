import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {BackButtonData, ExceptionData} from './types';

@Component({
  selector: 'not-found',
  template: `
    <exception [data]="data" [enableBack]="enableBack" [backBtn]="backBtn" (backEvent)="onBack()"></exception>
  `,
})
export class NotFoundComponent implements OnInit {

  @Input() data: ExceptionData = {
    status: '404',
    title: '404',
    desc: 'Sorry, the page you visited does not exist.'
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
