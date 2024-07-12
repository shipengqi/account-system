import {Component, Input} from '@angular/core';
import {NzSafeAny} from 'ng-zorro-antd/core/types';

import {NoticeListItem} from './types';

@Component({
  selector: 'app-header-notify-item',
  template: `
    <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
      <div nz-col [nzSpan]="4" class="text-center">
        <nz-avatar *ngIf="this.data.avatar; else elseAvatar" [nzSrc]="this.data.avatar" [ngStyle]="getAvatarBc()"></nz-avatar>
        <ng-template #elseAvatar>
          <nz-avatar [nzIcon]="getIcon()" [ngStyle]="getAvatarBc()"></nz-avatar>
        </ng-template>
      </div>
      <div nz-col [nzSpan]="20">
        <strong *ngIf="data.title"> {{ data.title }} </strong>
        <div class="header-notify-item-extra" *ngIf="data.extra">
          <nz-tag [nzColor]="data['extraColor']">{{ data.extra }}</nz-tag>
        </div>
        <p class="mb0">{{ data.description }}</p>
        <div *ngIf="data.datetime" class="header-notify-item-time">{{ data.datetime }}</div>
      </div>
    </div>
  `,
})
export class HeaderNotifyItemComponent {

  @Input() data: NoticeListItem = [];
  getIcon(): string {
    if (this.data.avatarIcon && this.data.avatarIcon !== '') {
      return this.data.avatarIcon;
    }
    return 'mail';
  }

  getAvatarBc(): NzSafeAny {
    if (this.data['avatarColor']) {
      return { 'background-color': this.data['avatarColor'] }
    }
    return;
  }

}
