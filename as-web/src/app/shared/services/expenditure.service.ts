import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {map, Observable} from "rxjs";

import {BasicService} from "./basic.service";
import {IExpenditure} from "../model/model";
import {IResponse, ListResponse} from "../model/res";
import moment from "moment";
import {resolve} from "@angular/compiler-cli";

const expendituresUrl = './api/v1/expenditures';

@Injectable({
  providedIn: 'root'
})
export class ExpenditureService extends BasicService {

  constructor(
    private _http: HttpClient
  ) {
    super();
  }

  list(
    pageIndex: number,
    pageSize: number
  ): Observable<ListResponse> {
    const params = {
      offset: pageIndex,
      limit: pageSize,
    };

    return this._http.get<ListResponse>(expendituresUrl, {params: params}).pipe(
      map((res) => {
        res.items = res.items.map((item) => {
          let ex = {
            ...item,
          } as IExpenditure
          ex.expend_at = moment(ex.expend_at).format('YYYY-MM-DD');
          return ex;
        });
        return res;
      })
    )
  }

  get(): Observable<IExpenditure> {
    return this._http.get<IResponse>(expendituresUrl).pipe(
      map((response) => response.data),
    )
  }

  create(data: any): Observable<IResponse> {
    return this._http.post<IResponse>(expendituresUrl, data)
  }

  update(data: any): Observable<IResponse> {
    return this._http.put<IResponse>(expendituresUrl, data);
  }

  delete(id: number): Observable<IResponse> {
    return this._http.delete<IResponse>(expendituresUrl, {})
  }
}
