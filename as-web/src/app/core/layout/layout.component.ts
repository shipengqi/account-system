import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterViewInit, OnDestroy,
} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';

import {LayoutOptions} from './types';
import {LayoutHeaderItemComponent} from './layout-header/layout-header-item/layout-header-item.component';
import {SideMenuItem} from './layout-sider/layout-sider.component';
import {LayoutService} from './layout.service';

@Component({
  selector: 'app-layout',
  exportAs: 'appLayout',
  template: `
    <app-layout-header [items]="headerItems"></app-layout-header>
    <div *ngIf="!options.hideSider" class="layout-side" [style.width.px]="siderWidth()">
      <ng-container *ngTemplateOutlet="sider"></ng-container>
      <app-layout-sider *ngIf="!sider" class="h-100"
                        [collapsible]="options.siderCollapsible"
                        [menus]="sideMenus"
                        [collapsed]="false">
      </app-layout-sider>
    </div>
    <section class="layout-content" [style.margin-left.px]="layoutContentLeftWidth()">
      <ng-container *ngTemplateOutlet="content"></ng-container>
      <ng-content></ng-content>
    </section>
  `,
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ContentChildren(LayoutHeaderItemComponent, {descendants: false})
  headerItems!: QueryList<LayoutHeaderItemComponent>;

  private destroy$ = new Subject<void>();

  sideCollapsed = false;

  @Input() options!: LayoutOptions;
  @Input() sider: TemplateRef<void> | null = null;
  @Input() content: TemplateRef<void> | null = null;
  @Input() sideMenus: SideMenuItem[] = [];

  constructor(private _svc: LayoutService) {}

  ngOnInit(): void {
    this._svc.setOptions(this.options);
  }

  ngAfterViewInit() {
    this._svc.collapsed$.pipe(takeUntil(this.destroy$)).subscribe((status) =>
      this.sideCollapsed = status
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  siderWidth(): number {
    return this.layoutContentLeftWidth();
  }

  layoutContentLeftWidth(): number {
    if (this._svc.options.hideSider) {
      return 0;
    }
    if (this.sideCollapsed) {
      return <number>this._svc.options.logoCollapsedWidth;
    }
    return <number>this._svc.options.logoExpandedWidth;
  }
}
