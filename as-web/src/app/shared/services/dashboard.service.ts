import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {BasicService} from "./basic.service";
import {
  OverallGeneral,
  OverallRevenueAndPayroll,
  TimelineExpenditure, TimelineProfit,
  TimelineRevenueAndPayroll
} from "../model/dashboard";

const analysisUrl = './api/v1/analysis';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BasicService {

  constructor(private _http: HttpClient) {
    super();
  }

  overallRevPay(): Observable<OverallRevenueAndPayroll> {
    return this._http.get<OverallRevenueAndPayroll>(analysisUrl+"/overall/revpay");
  }

  overallExp(): Observable<OverallGeneral> {
    return this._http.get<OverallGeneral>(analysisUrl+"/overall/exp");
  }

  timelineRevPay(): Observable<TimelineRevenueAndPayroll> {
    return this._http.get<TimelineRevenueAndPayroll>(analysisUrl+"/timeline/revpay");
  }

  timelineExp(): Observable<TimelineExpenditure> {
    return this._http.get<TimelineExpenditure>(analysisUrl+"/timeline/exp");
  }

  timelineProfit(): Observable<TimelineProfit> {
    return this._http.get<TimelineProfit>(analysisUrl+"/timeline/profit");
  }
}
