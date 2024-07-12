import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExceptionData, BackButtonData} from './types';

@Component({
  selector: 'exception',
  exportAs: 'exception',
  template: `
    <nz-result [nzStatus]="data.status" [nzTitle]="data.title | translate" [nzSubTitle]="data.desc | translate" [style.margin-top.px]="marginTop">
      <div *ngIf="enableBack" nz-result-extra>
        <button nz-button [nzType]="backBtn.type" (click)="onBackClick()"> {{backBtn.name | translate}} </button>
      </div>
    </nz-result>
  `,
})
export class ExceptionComponent implements OnInit {

  @Input() data!: ExceptionData;
  @Input() marginTop = 48;
  @Input() enableBack = true;
  @Input() backBtn: BackButtonData = {
    type: 'primary',
    name: 'Back Home'
  };
  @Output() backEvent = new EventEmitter();

  ngOnInit(): void {}

  onBackClick() {
    this.backEvent.emit();
  }
}
