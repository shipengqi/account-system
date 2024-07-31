import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {IVehicle} from "../model/model";
import {IResponse, ListResponse} from "../model/res";

const vehiclesUrl = './api/v1/vehicles';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  constructor(private _http: HttpClient) {}

  listAll(): Observable<ListResponse> {
    return this._http.get<ListResponse>(vehiclesUrl);
  }

  list(
    pageIndex: number,
    pageSize: number
  ): Observable<ListResponse> {
    const params = {
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
    };

    return this._http.get<ListResponse>(vehiclesUrl, {params: params});
  }

  get(): Observable<IVehicle> {
    return this._http.get<IVehicle>(vehiclesUrl);
  }

  create(data: any): Observable<IResponse> {
    return this._http.post<IResponse>(vehiclesUrl, data)
  }

  update(data: any): Observable<IResponse> {
    return this._http.put<IResponse>(vehiclesUrl, data);
  }

  delete(id: number): Observable<IResponse> {
    return this._http.delete<IResponse>(vehiclesUrl, {params: {id: id}});
  }
}
