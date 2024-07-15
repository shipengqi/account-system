import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {IResponse, ListResponse} from "../model/res";
import {IVehicle} from "../model/model";
import {HttpClient} from "@angular/common/http";
import {BasicService} from "./basic.service";

const driversUrl = './api/v1/drivers';

@Injectable({
  providedIn: 'root'
})
export class DriversService extends BasicService {

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
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
    };

    return this._http.get<ListResponse>(driversUrl, {params: params});
  }

  get(): Observable<IVehicle> {
    return this._http.get<IVehicle>(driversUrl);
  }

  create(data: any): Observable<IResponse> {
    return this._http.post<IResponse>(driversUrl, data)
  }

  update(data: any): Observable<IResponse> {
    return this._http.put<IResponse>(driversUrl, data);
  }

  delete(id: number): Observable<IResponse> {
    return this._http.delete<IResponse>(driversUrl, {params: {id: id}});
  }
}
