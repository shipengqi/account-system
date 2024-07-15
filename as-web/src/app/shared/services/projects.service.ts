import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {IResponse, ListResponse} from "../model/res";
import {IVehicle} from "../model/model";
import {HttpClient} from "@angular/common/http";
import {BasicService} from "./basic.service";

const projectsUrl = './api/v1/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends BasicService {

  constructor(private _http: HttpClient) {
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
