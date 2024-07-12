import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {LayoutOptions} from './types';

const DEFAULT: LayoutOptions = {
  logoLink: '/',
  logoHidden: 'mobile',
  logoExpandedWidth: 200,
  logoCollapsedWidth: 80,
  hideSider: false,
  siderCollapsible: true
};

@Injectable({providedIn: 'root'})
export class LayoutService {
  private _options: LayoutOptions = DEFAULT;
  private _options$ = new BehaviorSubject<LayoutOptions>(DEFAULT);
  private _collapsed = false;
  private _collapsed$ = new BehaviorSubject<boolean>(false);

  get options(): LayoutOptions {
    return this._options;
  }

  get options$(): Observable<LayoutOptions> {
    return this._options$.asObservable();
  }

  get collapsed$(): Observable<boolean> {
    return this._collapsed$.asObservable();
  }

  private notify(): void {
    // ??? remove
    this._options$.next(this._options);
    this._collapsed$.next(this._collapsed);
  }

  /**
   * Set layout configuration
   */
  setOptions(options?: LayoutOptions | null): void {
    this._options = {
      ...DEFAULT,
      ...options
    };
    this.notify();
  }

  /**
   * Toggle the collapsed state of the sidebar menu bar
   */
  toggleCollapsed(status: boolean = false): void {
    this._collapsed = status;
    this.notify();
  }
}
