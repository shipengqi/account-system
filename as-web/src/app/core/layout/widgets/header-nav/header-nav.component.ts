import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import {Subject} from 'rxjs';

import {HeaderNavItem} from './types';
import {HeaderNavService} from './header-nav.service';

@Component({
  selector: 'app-header-nav',
  template: `
    <div *ngIf="items.length > 0" class="d-flex layout-header-items-center px-sm">
      <app-header-nav-item *ngFor="let item of items" [item]="item"></app-header-nav-item>
    </div>
  `,
  providers: [HeaderNavService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavComponent implements OnDestroy, AfterViewInit {

  private destroy$ = new Subject<void>();

  @Input() items: HeaderNavItem[] = [];
  constructor(
    private _headerNavService: HeaderNavService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this._headerNavService.setItems(this.items);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
