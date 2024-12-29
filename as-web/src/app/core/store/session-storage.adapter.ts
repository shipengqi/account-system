/**
 * Copyright 2017 - 2025 Open Text.
 *
 * The only warranties for products and services of Open Text and its affiliates and licensors ("Open Text")
 * are as may be set forth in the express warranty statements accompanying such products and services.
 * Nothing herein should be construed as constituting an additional warranty. Open Text shall not be liable
 * for technical or editorial errors or omissions contained herein. The information contained herein is subject
 * to change without notice.
 *
 * Except as specifically indicated otherwise, this document contains confidential information and a valid
 * license is required for possession, use or copying. If this work is provided to the U.S. Government,
 * consistent with FAR 12.211 and 12.212, Commercial Computer Software, Computer Software
 * Documentation, and Technical Data for Commercial Items are licensed to the U.S. Government under
 * vendor's standard commercial license.
 */
import {Platform} from '@angular/cdk/platform';
import {inject, InjectionToken} from '@angular/core';

import {IValue, IStore} from './interface';

export const STORE_SESSION_STORAGE_ADAPTER = new InjectionToken<IStore>('STORE_SESSION_STORAGE_ADAPTER', {
  providedIn: 'root',
  factory: () => new SessionStorageAdapter()
});

export class SessionStorageAdapter implements IStore {
  private readonly _platform = inject(Platform);
  private _meta: Set<string> = new Set<string>();

  has(key: string): boolean {
    return this._meta.has(key);
  }

  get(key: string): IValue | null {
    if (!this._platform.isBrowser) return null;

    return JSON.parse(sessionStorage.getItem(key) || 'null') || null;
  }

  set(key: string, value: IValue) {
    if (!this._platform.isBrowser) return;

    this._meta.add(key);
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this._platform.isBrowser) return;

    this._meta.delete(key);
    sessionStorage.removeItem(key);
  }

  clear(): void {
    if (!this._platform.isBrowser) return;

    this._meta.forEach(key => this.remove(key));
  }
}
