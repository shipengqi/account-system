import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

import {IResponse, ListResponse} from "../model/res";
import {BasicService} from "./basic.service";
import {IOrder, OrderSearchData} from "../model/order";
import {IExpenditure} from "../model/model";
import moment from "moment/moment";

const ordersUrl = './api/v1/orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends BasicService {

  constructor(private _http: HttpClient) {
    super();
  }

  list(
    pageIndex: number,
    pageSize: number,
    searchData?: OrderSearchData
  ): Observable<ListResponse> {
    const params: any = {
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
    };
    if (searchData) {
      if (searchData.vehicle_id > -1) {
        params['vehicle_id'] = searchData.vehicle_id;
      }
      if (searchData.driver_id > -1) {
        params['driver_id'] = searchData.driver_id;
      }
      if (searchData.project_id > -1) {
        params['project_id'] = searchData.project_id;
      }
      if (searchData.unload_range?.length > 1) {
        params['unload_start'] = moment(searchData.unload_range[0]).format('YYYY-MM-DD');
        params['unload_end'] = moment(searchData.unload_range[1]).format('YYYY-MM-DD');
      }
    }

    return this._http.get<ListResponse>(ordersUrl, {params: params}).pipe(
      map((res) => {
        res.items = res.items.map((item) => {
          let ex = {
            ...item,
          } as IOrder
          ex.unload_at = moment(ex.unload_at).format('YYYY-MM-DD');
          ex.load_at = moment(ex.load_at).format('YYYY-MM-DD');
          return ex;
        });
        return res;
      })
    );
  }

  get(): Observable<IExpenditure> {
    return this._http.get<IExpenditure>(ordersUrl);
  }

  create(data: any): Observable<IResponse> {
    return this._http.post<IResponse>(ordersUrl, data)
  }

  update(data: any): Observable<IResponse> {
    return this._http.put<IResponse>(ordersUrl, data);
  }

  delete(id: number): Observable<IResponse> {
    return this._http.delete<IResponse>(ordersUrl, {params: {id: id}})
  }
}
