import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {IVehicle} from "../model/model";
import {IResponse, ListResponse} from "../model/res";

const projectsUrl = './api/v1/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private _http: HttpClient) {}

  listAll(): Observable<ListResponse> {
    return this._http.get<ListResponse>(projectsUrl);
  }

  list(
    pageIndex: number,
    pageSize: number
  ): Observable<ListResponse> {
    const params = {
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
    };

    return this._http.get<ListResponse>(projectsUrl, {params: params});
  }

  get(): Observable<IVehicle> {
    return this._http.get<IVehicle>(projectsUrl);
  }

  create(data: any): Observable<IResponse> {
    return this._http.post<IResponse>(projectsUrl, data)
  }

  update(data: any): Observable<IResponse> {
    return this._http.put<IResponse>(projectsUrl, data);
  }

  delete(id: number): Observable<IResponse> {
    return this._http.delete<IResponse>(projectsUrl, {params: {id: id}});
  }
}
