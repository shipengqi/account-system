import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import moment from "moment";
import {map, Observable} from "rxjs";

import {IResponse, ListResponse} from "../model/res";
import {ExpenditureSearchData, IExpenditure} from "../model/model";

const expendituresUrl = './api/v1/expenditures';

@Injectable({
  providedIn: 'root'
})
export class ExpenditureService {

  constructor(private _http: HttpClient) {}

  list(
    pageIndex: number,
    pageSize: number,
    searchData?: ExpenditureSearchData
  ): Observable<ListResponse> {
    const params: any = {
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
    };
    if (searchData) {
      if (searchData.type > -1) {
        params['type'] = searchData.type;
      }
      if (searchData.vehicle_id > -1) {
        params['vehicle_id'] = searchData.vehicle_id;
      }
      if (searchData.expend_range?.length > 1) {
        params['expend_start'] = moment(searchData.expend_range[0]).format('YYYY-MM-DD');
        params['expend_end'] = moment(searchData.expend_range[1]).format('YYYY-MM-DD');
      }
      if (searchData.expend_at_order) {
        params['expend_at_order'] = searchData.expend_at_order;
      }
    }

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
    );
  }

  get(): Observable<IExpenditure> {
    return this._http.get<IExpenditure>(expendituresUrl);
  }

  create(data: any): Observable<IResponse> {
    return this._http.post<IResponse>(expendituresUrl, data)
  }

  update(data: any): Observable<IResponse> {
    return this._http.put<IResponse>(expendituresUrl, data);
  }

  delete(id: number): Observable<IResponse> {
    return this._http.delete<IResponse>(expendituresUrl, {params: {id: id}})
  }
}
