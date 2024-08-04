import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import moment from "moment/moment";
import {Observable} from "rxjs";

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
export class DashboardService {

  constructor(private _http: HttpClient) {}

  overallRevPay(): Observable<OverallRevenueAndPayroll> {
    return this._http.get<OverallRevenueAndPayroll>(analysisUrl+"/overall/revpay");
  }

  overallExp(): Observable<OverallGeneral> {
    return this._http.get<OverallGeneral>(analysisUrl+"/overall/exp");
  }

  timelineRevPay(vehicleIds: number[], driverIds: number[],
                 range?: (Date | null)[]): Observable<TimelineRevenueAndPayroll> {
    const params = getDateRangeParam(range);
    if (vehicleIds?.length > 0) {
      params.vehicles = vehicleIds;
    }
    if (driverIds?.length > 0) {
      params.drivers = driverIds;
    }
    return this._http.get<TimelineRevenueAndPayroll>(analysisUrl+"/timeline/revpay", {params: params});
  }

  timelineExp(vehicleIds: number[], searchType: number = -1, range?: (Date | null)[]): Observable<TimelineExpenditure> {
    const params = getDateRangeParam(range);
    if (searchType > -1) {
      params.type = searchType;
    }
    if (vehicleIds?.length > 0) {
      params.vehicles = vehicleIds;
    }
    return this._http.get<TimelineExpenditure>(analysisUrl+"/timeline/exp", {params: params});
  }

  timelineProfit(vehicleIds: number[], range?: (Date | null)[]): Observable<TimelineProfit> {
    const params = getDateRangeParam(range);
    if (vehicleIds?.length > 0) {
      params.vehicles = vehicleIds;
    }
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
