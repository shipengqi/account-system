import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {skip, Subject, takeUntil} from 'rxjs';

import {LayoutService, SideMenuItem} from '../core/layout';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.less'
})
export class PagesComponent implements OnInit, OnDestroy {
  sideCollapsed = false;
  sideMenus: SideMenuItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _svc: LayoutService
  ) {}

  ngOnInit(): void {
    this.sideMenus = [
      {
        level: 1,
        title: 'sider.dashboard',
        icon: 'fund-projection-screen',
        routerLink: ['/dashboard']
      },
      {
        level: 1,
        title: 'sider.orders',
        icon: 'pic-right',
        routerLink: ['/orders']
      },
      {
        level: 1,
        title: 'sider.expenditure',
        icon: 'money-collect',
        routerLink: ['/expenditure']
      },
      {
        level: 1,
        title: 'sider.vehicles',
        icon: 'truck',
        routerLink: ['/vehicles']
      },
      {
        level: 1,
        title: 'sider.drivers',
        icon: 'usergroup-add',
        routerLink: ['/drivers']
      },
      {
        level: 1,
        title: 'sider.projects',
        icon: 'product',
        routerLink: ['/projects']
      },
    ]

    // use `skip(1)` to skip the first value, since there are two layout-sider subscribed to the collapsed$,
    // the first value may be triggered by the other sider
    this._svc.collapsed$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((status) =>
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
    if (this.sideCollapsed) {
      return <number>this._svc.options.logoCollapsedWidth;
    }
    return <number>this._svc.options.logoExpandedWidth;
  }
}
