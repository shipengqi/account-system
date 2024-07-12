import {Injectable, OnDestroy} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

import {HeaderNavItem} from './types';

@Injectable()
export class HeaderNavService implements OnDestroy {
  selected$ = new BehaviorSubject<HeaderNavItem | null>(null);
  items: HeaderNavItem[] = [];

  /** Unsubscribe on destroy */
  private destroy$ = new Subject<void>();

  constructor(private _router: Router) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError),
      takeUntil(this.destroy$)
    ).subscribe(() =>
      this.updateItemsWithActiveRoute()
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  select(item: HeaderNavItem, navigate = true): void {
    if (!item) return;

    this.deselectAll();
    if (item.routerLink && navigate) {
      item.selected = true;
      // Trigger router navigation
      const routerLink = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
      this._router.navigate(routerLink, item.routerExtras);
    } else {
      // Otherwise select the given item
      this.selected$.next(item);
    }
  }

  deselect(item: HeaderNavItem): void {
    // deselect the current item
    item.selected = false;
  }

  deselectAll(): void {
    this.items.forEach(item => this.deselect(item));
  }

  updateItem(item: HeaderNavItem, selected: HeaderNavItem | null): void {
    if (!selected) {
      return;
    }
    // Item is selected if it is the selected item.
    item.selected = item === selected;

    if (item.selected) {
      // call the select function if present
      if (item.select) {
        item.select.call(item, item);
      }
    }
  }

  setItems(items: HeaderNavItem[] = []): void {
    this.items = items;

    // Set up the initially selected item
    // If nothing is set as selected, using the initial route
    const initialSelectedItem = items.find(item => item.selected === true);
    if (initialSelectedItem) {
      this.select(initialSelectedItem);
    } else {
      this.updateItemsWithActiveRoute();
    }
  }

  private updateItemsWithActiveRoute(): void {
    const activeItem = new ActiveHeaderNavItem();
    for (const item of this.items) {
      this.findActiveItem(item, activeItem);
      if (activeItem.exact) {
        break;
      }
    }

    if (activeItem.item) {
      this.selected$.next(activeItem.item);
    }
  }

  private findActiveItem(item: HeaderNavItem, activeItem: ActiveHeaderNavItem): void {
    if (!item.routerLink) return;

    const routerLink = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
    const urlTree = this._router.createUrlTree(routerLink, item.routerExtras);

    if (this._router.isActive(urlTree, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    }) && !activeItem.exact) {

      // When the item route is an exact match, no need to look any further
      activeItem.item = item;
      activeItem.exact = true;

      return;
    }
    if (this._router.isActive(urlTree, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })) {
      // Store an inexact match and continue looking
      activeItem.item = item;
      activeItem.exact = false;
    }
  }
}


class ActiveHeaderNavItem {
  item?: HeaderNavItem;
  exact?: boolean;
}
