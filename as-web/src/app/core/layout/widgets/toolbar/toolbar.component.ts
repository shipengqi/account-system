import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren, HostBinding,
  OnDestroy,
  QueryList,
  TemplateRef
} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {NzSafeAny} from 'ng-zorro-antd/core/types';

import {ToolbarItemDirection, ToolbarItemHidden} from '../../types';
import {ToolbarItemComponent} from './toolbar-item/toolbar-item.component';

export interface ToolbarItem {
  host: TemplateRef<NzSafeAny>;
  hidden?: ToolbarItemHidden;
  direction?: ToolbarItemDirection;
}

@Component({
  selector: 'app-toolbar',
  template: `
    <ng-template #render let-ls>
      <li *ngFor="let i of ls" [class.hidden-mobile]="i.hidden === 'mobile'" [class.hidden-pc]="i.hidden === 'pc'">
        <ng-container *ngTemplateOutlet="i.host"></ng-container>
      </li>
    </ng-template>
    <div class="toolbar">
      <ul class="toolbar-nav">
        <ng-template [ngTemplateOutlet]="render" [ngTemplateOutletContext]="{ $implicit: left }"></ng-template>
      </ul>
      <ul class="toolbar-nav">
        <ng-template [ngTemplateOutlet]="render" [ngTemplateOutletContext]="{ $implicit: right }"></ng-template>
      </ul>
    </div>
  `,
  // host: {
  //   '[class.toolbar]': 'true',
  // },
})
export class ToolbarComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Equals to the following:
  //   host: {
  //     '[class.toolbar]': 'true',
  //   },
  @HostBinding('class.toolbar')

  // Todo may need support in the future
  // middle: ToolbarItem[] = [];

  left: ToolbarItem[] = [];
  right: ToolbarItem[] = [];

  @ContentChildren(ToolbarItemComponent, {descendants: false})
  items!: QueryList<ToolbarItemComponent>;

  constructor(private _cdr: ChangeDetectorRef) {}

  private refresh(): void {
    if (!this.items) {
      return;
    }
    const arr = this.items.toArray();
    this.left = arr.filter(i => i.direction === 'left');
    this.right = arr.filter(i => i.direction === 'right');
    this._cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    if (!this.items) {
      return;
    }
    this.items.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.refresh());
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
