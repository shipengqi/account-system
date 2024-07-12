import {Component, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';

import {HeaderNavItem} from '../types';
import {HeaderNavService} from '../header-nav.service';

@Component({
  selector: 'app-header-nav-item',
  template: `
    <button #navBtn [id]="_id" class="layout-header-nav-item px-sm layout-header-nav" (click)="select()">
      <nz-avatar *ngIf="item.avatar && item.avatar !== ''" [nzSrc]="item.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      <span class="layout-header-nav-title" [class.selected]="item.selected"> {{ item.name | translate }} </span>
    </button>
  `,
})
export class HeaderNavItemComponent implements OnDestroy, AfterViewInit {
  /** Unsubscribe when the component is destroyed */
  private destroy$ = new Subject<void>();

  @Input() item!: HeaderNavItem;

  get _id(): string {
    return this.item.id ? this.item.id : 'header-nav-' + normalizeName(this.item.name) + '-id';
  }

  /** Access the navigation button element */
  @ViewChild('navigationBtn', { static: false }) navBtn!: ElementRef;

  constructor(
    private _headerNavService: HeaderNavService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this._headerNavService.selected$.pipe(takeUntil(this.destroy$)).subscribe(selectedItem => {
      // Update selected state for this item
      this._headerNavService.updateItem(this.item, selectedItem);
      this._cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  focus(): void {
    this.navBtn.nativeElement.focus();
  }

  select(): void {
    this._headerNavService.select(this.item);
  }
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\./g, '-')
    .replace(/_/g, '-')
}
