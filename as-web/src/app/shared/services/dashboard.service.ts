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
import moment from "moment/moment";

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

  timelineRevPay(range?: (Date | null)[]): Observable<TimelineRevenueAndPayroll> {
    const params = getDateRangeParam(range);
    return this._http.get<TimelineRevenueAndPayroll>(analysisUrl+"/timeline/revpay", {params: params});
  }

  timelineExp(searchType: number = -1, range?: (Date | null)[]): Observable<TimelineExpenditure> {
    const params = getDateRangeParam(range);
    if (searchType > -1) {
      params.type = searchType;
    }
    return this._http.get<TimelineExpenditure>(analysisUrl+"/timeline/exp", {params: params});
  }

  timelineProfit(range?: (Date | null)[]): Observable<TimelineProfit> {
    const params = getDateRangeParam(range);
    return this._http.get<TimelineProfit>(analysisUrl+"/timeline/profit", {params: params});
  }
}

function getDateRangeParam(range?: (Date | null)[]): any {
  const params: any = {}
  if (range && range.length > 1) {
    params['timeline'] = [
      moment(range[0]).format('YYYY-MM-DD'),
      moment(range[1]).format('YYYY-MM-DD')
    ]
  }
  return params;
}
