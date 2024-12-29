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
import {Inject, inject, Injectable} from '@angular/core';
import {Platform} from '@angular/cdk/platform';

import {catchError, Observable, of, Subject, tap, throwError} from 'rxjs';

import {IValue} from './interface';
import {StorageType} from './store.types';
import {STORE_MEMORY_ADAPTER} from './memory.adapter';
import {STORE_LOCAL_STORAGE_ADAPTER} from './local-storage.adapter';
import {STORE_SESSION_STORAGE_ADAPTER} from './session-storage.adapter';
import {STORE_CONFIG_TOKEN, STORE_DEFAULT_CONFIG, StoreConfig} from './store.config';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly _platform = inject(Platform);
  private readonly _mem = inject(STORE_MEMORY_ADAPTER);
  private readonly _ls = inject(STORE_LOCAL_STORAGE_ADAPTER);
  private readonly _ss = inject(STORE_SESSION_STORAGE_ADAPTER);
  private readonly _options: StoreConfig = STORE_DEFAULT_CONFIG;
  private readonly _runq: Map<string, Subject<any>> = new Map<
    string,
    Subject<any>
  >();

  constructor(@Inject(STORE_CONFIG_TOKEN) cfg: StoreConfig) {
    this._options = Object.assign({}, this._options, cfg);
  }

  /**
   * Store a `Observable` object, for example:
   * - `set('data/1', this.http.get('data/1')).subscribe()`
   * - `set('data/1', this.http.get('data/1'), {type: 'ss'}).subscribe()`
   *
   * Note: Unsubscribing is necessary when not needed, as duplicate Observables may return a Subject.
   */
  set<T>(
    key: string,
    data: Observable<T>,
    options?: { type?: StorageType }
  ): Observable<T>;

  /**
   * Store a `Observable` object, for example:
   * - `set('data/1', this.http.get('data/1')).subscribe()`
   * - `set('data/1', this.http.get('data/1'), {type: 'ss'}).subscribe()`
   *
   * Note: Unsubscribing is necessary when not needed, as duplicate Observables may return a Subject.
   */
  set(
    key: string,
    data: Observable<any>,
    options?: { type?: StorageType }
  ): Observable<any>;

  /**
   * Store a simple value, for example:
   * - `set('data/1', 1)`
   * - `set('data/1', {type: 'ls'})`
   *
   * Note: Unsubscribing is necessary when not needed, as duplicate Observables may return a Subject.
   */
  set(
    key: string,
    data: unknown,
    options?: { type?: StorageType }
  ): void;
  set(
    key: string,
    data: any | Observable<any>,
    options: { type?: StorageType } = {}
  ): any {
    options = Object.assign({}, this._options, options);

    // localStorage and sessionStorage are web storage APIs provided by browsers
    // to store key-value pairs. They are only supported in browser environments
    // and are not available in non-browser environments like Node.js.
    if (!this._platform.isBrowser && options.type !== 'mem') return;

    if (!(data instanceof Observable)) {
      this._save(options.type!, key, { v: data });
      return;
    }

    const running = this._runq.get(key);
    if (running) {
      return running;
    } else {
      const sub$ = new Subject<any>();
      this._runq.set(key, sub$);
      return data.pipe(
        tap((v: any) => {
          this._save(options.type!, key, { v });

          sub$.next(v);
          sub$.complete();
          this._runq.delete(key);
        }),
        catchError(err => {
          sub$.error(err);
          this._runq.delete(key);

          return throwError(() => err);
        })
      );
    }
  }

  /**
   * Get value.
   * If `key` does not exist, return `null`.
   * */
  get(
    key: string,
    options?: { type?: StorageType }
  ): any {
    let value: IValue | null = null;
    let t: StorageType | '' = '';
    if (options && options.type) {
      t = options.type;
    }

    if (!this._platform.isBrowser) {
      value = this._mem.get(key);
    } else if (t !== '') {
      if (t === 'ls') {
        value = this._ls.get(key);
      } else if (t === 'ss') {
        value = this._ss.get(key);
      } else if (t === 'mem') {
        value = this._mem.get(key);
      }
    } else {
      value = this._mem.get(key);
      if (!value) {
        value = this._ss.get(key);
      }
      if (!value) {
        value = this._ls.get(key);
      }
    }

    return value ? value.v : null;
  }

  /**
   * Get value
   * If `key` does not exist, store the `Observable` object.
   *
   * Note: Unsubscribing is necessary when not needed, as duplicate Observables may return a Subject.
   */
  tryGet<T>(
    key: string,
    data: Observable<T>,
    options?: { type?: StorageType }
  ): Observable<T>;
  /**
   * Get value
   * If `key` does not exist, store the `Observable` object.
   *
   * Note: Unsubscribing is necessary when not needed, as duplicate Observables may return a Subject.
   */
  tryGet(
    key: string,
    data: Observable<any>,
    options?: { type?: StorageType }
  ): Observable<any>;
  /**
   * Get value
   * If `key` does not exist, store the given value.
   *
   * Note: Unsubscribing is necessary when not needed, as duplicate Observables may return a Subject.
   */
  tryGet(
    key: string,
    data: unknown,
    options?: { type?: StorageType }
  ): any;
  tryGet(
    key: string,
    data: any | Observable<any>,
    options: { type?: StorageType } = {}
  ): any {
    const result = this.get(key, options);
    if (result === null) {
      if (!(data instanceof Observable)) {
        this.set(key, data, options);
        return data;
      }
      return this.set(key, data, options);
    }
    return of(result);
  }

  has(key: string): boolean {
    let exists = this._mem.has(key);
    if (exists) {
      return true;
    }
    exists = this._ss.has(key);
    if (exists) {
      return true;
    }
    exists = this._ls.has(key);
    return exists;
  }

  remove(key: string): void {
    this._remove(key);
  }

  clear(): void {
    this._mem.clear();
    this._ss.clear();
    this._ls.clear();
  }

  private _save(type: StorageType, key: string, value: IValue): void {
    if (type === 'ls') {
      this._ls.set(key, value);
    } else if (type === 'ss') {
      this._ss.set(key, value);
    } else {
      this._mem.set(key, value);
    }
  }

  private _remove(key: string): void {
    this._mem.remove(key);

    if (this._platform.isBrowser) {
      this._ls.remove(key);
      this._ss.remove(key);
    }
  }
}
