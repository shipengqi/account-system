import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

import {NoticeListItem, NoticeSelect} from './types';

@Component({
  selector: 'app-header-notify',
  templateUrl: './header-notify.component.html',
  styleUrls: ['./header-notify.component.less'],
  // host: { '[class.header-notify-btn]': 'true' },
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class HeaderNotifyComponent implements OnInit {

  // Equals to the following:
  // host: { '[class.header-notify-btn]': 'true' }
  @HostBinding('class.header-notify-btn')
  @Input() data: NoticeListItem[] = [];
  @Input() count = 0;
  @Input() showDot = false;
  @Input() showSeeAll = true;
  @Input() loading = true;
  @Input() popoverVisible = false;
  @Input() centered = false;
  @Input() notifyTitle = 'core.notify.title';
  @Input() seeAllTitle = 'core.notify.see-all';
  @Output() readonly selectChange = new EventEmitter<NoticeSelect>();
  @Output() readonly clear = new EventEmitter<string>();
  @Output() readonly popoverVisibleChange = new EventEmitter<boolean>();
  @Output() readonly seeAll = new EventEmitter<void>();

  get overlayCls(): string {
    return `header-dropdown header-notify${!this.centered ? ' header-notify-tab-left' : ''}`;
  }

  ngOnInit(): void {
    // Todo should be removed
    setTimeout(() => {
      this.loading = false;
    }, 2000)
  }

  onVisibleChange(result: boolean): void {
    this.popoverVisibleChange.emit(result);
  }

  onSelect(i: NoticeListItem): void {
    this.selectChange.emit({title: i.title || '', item: i});
  }

  onClear(title: string): void {
    this.clear.emit(title);
  }
}
