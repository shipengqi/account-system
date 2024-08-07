import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";
import {BuildInfo} from "../model/config";

const buildInfoUrl = './api/v1/config/buildInfo';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private _http: HttpClient) {}

  getBuildInfo(): Observable<BuildInfo> {
    return this._http.get<BuildInfo>(buildInfoUrl);
  }
}
