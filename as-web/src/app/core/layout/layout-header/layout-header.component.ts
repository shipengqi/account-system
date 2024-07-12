import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef
} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import type {NzSafeAny} from 'ng-zorro-antd/core/types';

import {LayoutHeaderItemComponent} from './layout-header-item/layout-header-item.component';
import {LayoutHeaderItemDirection, LayoutHeaderItemHidden, LayoutOptions} from '../types';
import {LayoutService} from '../layout.service';

interface LayoutHeaderItem {
  host: TemplateRef<NzSafeAny>;
  hidden?: LayoutHeaderItemHidden;
  direction?: LayoutHeaderItemDirection;
}

@Component({
  selector: 'app-layout-header',
  template: `
    <ng-template #render let-ls>
      <li *ngFor="let i of ls" [class.hidden-mobile]="i.hidden === 'mobile'" [class.hidden-pc]="i.hidden === 'pc'">
        <ng-container *ngTemplateOutlet="i.host"></ng-container>
      </li>
    </ng-template>
    <div class="layout-header-logo" [style.width.px]="logoWidth()"
         [class.hidden-mobile]="options.logoHidden === 'mobile'"
         [class.hidden-pc]="options.logoHidden === 'pc'">
      <ng-container *ngIf="!options.logo; else options.logo!">
        <a [routerLink]="options.logoLink" class="layout-header-logo-link">
          <img *ngIf="options.logoExpanded; else logoText" class="layout-header-logo-full"
               [attr.src]="logoUrl()" alt=""/>
          <!-- Todo app.name -->
          <!--<img class="layout-header-logo-full" [attr.src]="options.logoFile" [attr.alt]="app.name"/>-->
          <ng-template #logoText>
            <span class="layout-header-logo-text"> {{ options.logoText }} </span>
          </ng-template>
        </a>
      </ng-container>
    </div>
    <div class="layout-nav-wrap">
      <ul class="layout-nav">
        <ng-template [ngTemplateOutlet]="render" [ngTemplateOutletContext]="{ $implicit: left }"></ng-template>
      </ul>
      <ul class="layout-nav">
        <ng-template [ngTemplateOutlet]="render" [ngTemplateOutletContext]="{ $implicit: right }"></ng-template>
      </ul>
    </div>
  `,
  // host: {
  //   '[class.layout-header]': 'true'
  // },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutHeaderComponent implements OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  // Equals to the following:
  // host: {
  //   '[class.layout-header]': 'true'
  // },
  @HostBinding('class.layout-header')

  // Todo may need support in the future, currently only need to support display on the left/right side
  // middle: LayoutHeaderItem[] = [];

  left: LayoutHeaderItem[] = [];
  right: LayoutHeaderItem[] = [];


  @Input() items!: QueryList<LayoutHeaderItemComponent>;

  constructor(
    private _svc: LayoutService,
    private _cdr: ChangeDetectorRef
  ) {}

  get options(): LayoutOptions {
    return this._svc.options;
  }

  private _collapsed = false;

  ngAfterViewInit(): void {
    this.items.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.refresh());
    this._svc.options$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refresh());
    this._svc.collapsed$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this._collapsed = status;
      this._cdr.detectChanges();
    });
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logoWidth(): number {
    if (this.options.logoFixWidth && this.options.logoFixWidth > 0) {
      return this.options.logoFixWidth;
    }
    if (this._collapsed) {
      return <number>this.options.logoCollapsedWidth;
    }
    return <number>this.options.logoExpandedWidth;
  }

  logoUrl(): string {
    if (this._collapsed && this.options.logoCollapsed) {
      return this.options.logoCollapsed;
    }
    return <string>this.options.logoExpanded;
  }

  private refresh(): void {
    const arr = this.items.toArray();
    this.left = arr.filter(i => i.direction === 'left');
    this.right = arr.filter(i => i.direction === 'right');
    this._cdr.detectChanges();
  }
}
