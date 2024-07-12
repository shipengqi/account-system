import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanMatch,
  Data,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of, map, tap } from 'rxjs';

import { ACLService } from './acl.service';
import { ACLCanType, ACLGuardType } from './acl.types';

/**
 * Routing guard prevent unauthorized users visit the page.
 *
 * ```ts
 * data: {
 *  path: 'home',
 *  canActivate: [ ACLGuard ],
 *  data: { guard: 'user1' }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ACLGuard implements CanActivate, CanActivateChild, CanMatch {

  constructor(
    private _svc: ACLService,
    private _router: Router,
    private _injector: Injector
  ) {}

  private process(data: Data): Observable<boolean> {
    data = {
      guard: null,
      guard_url: this._svc.guard_url,
      ...data
    };
    let guard: ACLGuardType = data['guard'];
    if (typeof guard === 'function') guard = guard(this._svc, this._injector);
    return (guard && guard instanceof Observable ? guard : of(guard != null ? (guard as ACLCanType) : null)).pipe(
      map(v => this._svc.can(v)),
      tap(v => {
        if (v) return;
        this._router.navigateByUrl(data['guard_url']);
      })
    );
  }

  // lazy loading
  canMatch(route: Route): Observable<boolean> {
    return this.process(route.data!);
  }
  // all children route
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
  // route
  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot | null): Observable<boolean> {
    return this.process(route.data);
  }
}
