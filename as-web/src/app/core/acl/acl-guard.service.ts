import {inject, Injectable, Injector} from '@angular/core';
import {CanActivateChildFn, CanActivateFn, CanMatchFn, Router} from '@angular/router';

import {map, Observable, of, tap} from 'rxjs';

import {ACLCanType} from './acl.types';
import {ACLService} from './acl.service';


export type ACLGuardFunctionType = (srv: ACLService, injector: Injector) => Observable<ACLCanType>;
export type ACLGuardType = ACLCanType | Observable<ACLCanType> | ACLGuardFunctionType;

export interface ACLGuardData {
  guard?: ACLGuardType | null;
  guard_url?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ACLGuardService {
  private readonly _acl = inject(ACLService);
  private readonly _router = inject(Router);
  private readonly _injector = inject(Injector);

  constructor() {}

  process(data?: ACLGuardData): Observable<boolean> {
    data = {
      guard: null,
      guard_url: this._acl.guard_url,
      ...data
    };
    let guard = data.guard;
    if (typeof guard === 'function') guard = guard(this._acl, this._injector);
    return (guard && guard instanceof Observable ? guard : of(guard != null ? (guard as ACLCanType) : null)).pipe(
      map(v => this._acl.can(v)),
      tap(v => {
        if (v) return;
        this._router.navigateByUrl(data!!.guard_url!!).then();
      })
    );
  }
}

/**
 * Routing guard prevent unauthorized users visit the page.
 *
 * ```ts
 * data: {
 *  path: 'home',
 *  canActivate: [ ACLCanActivate ],
 *  data: { guard: 'user' }
 * }
 * ```
 */
export const ACLCanActivate: CanActivateFn = route => inject(ACLGuardService).process(route.data);

/**
 * Routing guard prevent unauthorized users visit the page.
 *
 * ```ts
 * data: {
 *  path: 'home',
 *  canActivateChild: [ ACLCanActivateChild ],
 *  data: { guard: 'user' }
 * }
 * ```
 */
export const ACLCanActivateChild: CanActivateChildFn = route => inject(ACLGuardService).process(route.data);

/**
 * Routing guard prevent unauthorized users visit the page.
 *
 * ```ts
 * data: {
 *  path: 'home',
 *  canMatch: [ ACLCanMatch ],
 *  data: { guard: 'user' }
 * }
 * ```
 */
export const ACLCanMatch: CanMatchFn = route => inject(ACLGuardService).process(route.data);
