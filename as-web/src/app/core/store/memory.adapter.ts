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
import {InjectionToken} from '@angular/core';

import {IValue, IStore} from './interface';

export const STORE_MEMORY_ADAPTER = new InjectionToken<IStore>('STORE_MEMORY_ADAPTER', {
  providedIn: 'root',
  factory: () => new MemoryAdapter()
});

export class MemoryAdapter implements IStore {
  private _store: Map<string, IValue> = new Map<string, IValue>();

  has(key: string): boolean {
    return this._store.has(key);
  }

  get(key: string): IValue | null {
    return this._store.get(key) || null;
  }

  set(key: string, value: IValue) {
    this._store.set(key, value);
  }

  remove(key: string): void {
    this._store.delete(key);
  }

  clear(): void {
    this._store.clear();
  }
}
