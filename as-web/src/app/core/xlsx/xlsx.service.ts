import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';

import type {NzSafeAny} from 'ng-zorro-antd/core/types';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import isUtf8 from 'isutf8';

import {LazyService, LazyResult, ZoneOutside} from '../utils';
import {XlsxExportOptions, XlsxExportResult, XlsxExportSheet} from './xlsx.types';

declare let XLSX: NzSafeAny;
declare let cptable: NzSafeAny;

@Injectable({providedIn: 'root'})
export class XlsxService {

  private _url = 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js';
  private _modules = ['https://cdn.jsdelivr.net/npm/xlsx/dist/cpexcel.js'];

  constructor(
    private _http: HttpClient,
    private _zone: NgZone,
    private _lazy: LazyService,
  ) {}

  private init(): Promise<LazyResult[]> {
    return typeof XLSX !== 'undefined'
      ? Promise.resolve([])
      : this._lazy.load([this._url].concat(this._modules!));
  }

  @ZoneOutside({ngZoneName: '_zone'})
  private read(data: NzSafeAny): { [key: string]: NzSafeAny[][] } {
    const {
      read,
      utils: { sheet_to_json }
    } = XLSX;
    const ret: NzSafeAny = {};
    const buf = new Uint8Array(data);
    let type = 'array';
    if (!isUtf8(buf)) {
      try {
        data = cptable.utils.decode(936, buf);
        type = 'string';
      } catch {
        // do nothing
      }
    }
    const wb = read(data, { type });
    wb.SheetNames.forEach((name: string) => {
      const sheet: NzSafeAny = wb.Sheets[name];
      ret[name] = sheet_to_json(sheet, { header: 1 });
    });
    return ret;
  }

  /**
   * Import xlsx and output json, support '<input type="file">', url and 'NzUploadFile'.
   * NzUploadFile issue: https://github.com/NG-ZORRO/ng-zorro-antd/issues/4744
   */
  import(fileOrUrl: File | NzUploadFile | string): Promise<{ [key: string]: NzSafeAny[][] }> {
    return new Promise<{ [key: string]: NzSafeAny[][] }>((resolve, reject) => {
      const r = (data: NzSafeAny): void => this._zone.run(() => resolve(this.read(data)));
      this.init()
        .then(() => {
          // from url
          if (typeof fileOrUrl === 'string') {
            this._http.request('GET', fileOrUrl, { responseType: 'arraybuffer' }).subscribe({
              next: (res: ArrayBuffer) => r(new Uint8Array(res)),
              error: (err: NzSafeAny) => reject(err)
            });
            return;
          }
          // from file
          const reader: FileReader = new FileReader();
          reader.onload = (e: NzSafeAny) => r(e.target.result);
          reader.onerror = (e: NzSafeAny) => reject(e);
          reader.readAsArrayBuffer(fileOrUrl as any);
        })
        .catch(() => reject('Unable to load xlsx.js'));
    });
  }

  /**
   * Export a xlsx file.
   */
  @ZoneOutside({ngZoneName: '_zone'})
  async export(options: XlsxExportOptions): Promise<XlsxExportResult> {
    return new Promise<XlsxExportResult>((resolve, reject) => {
      this.init().then(() => {
        options = {format: 'xlsx', ...options};
        const {
          writeFile,
          utils: {book_new, aoa_to_sheet, book_append_sheet}
        } = XLSX;
        const wb: NzSafeAny = book_new();
        if (Array.isArray(options.sheets)) {
          (options.sheets as XlsxExportSheet[]).forEach((value: XlsxExportSheet, index: number) => {
            const ws: NzSafeAny = aoa_to_sheet(value.data);
            book_append_sheet(wb, ws, value.name || `Sheet${index + 1}`);
          });
        } else {
          wb.SheetNames = Object.keys(options.sheets);
          wb.Sheets = options.sheets;
        }

        if (options.callback) options.callback(wb);

        const filename = options.filename || `export.${options.format}`;
        writeFile(wb, filename, {
          bookType: options.format,
          bookSST: false,
          type: 'array',
          ...options.opts
        });

        resolve({filename, wb});
      }).catch(err => reject(err));
    })
  }
}
