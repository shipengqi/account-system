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

  timelineRevPay(): Observable<TimelineRevenueAndPayroll> {
    // if (searchData.expend_range?.length > 1) {
    //   params['start'] = moment(searchData.expend_range[0]).format('YYYY-MM-DD');
    //   params['end'] = moment(searchData.expend_range[1]).format('YYYY-MM-DD');
    // }
    return this._http.get<TimelineRevenueAndPayroll>(analysisUrl+"/timeline/revpay");
  }

  timelineExp(): Observable<TimelineExpenditure> {
    // if (searchData.expend_range?.length > 1) {
    //   params['start'] = moment(searchData.expend_range[0]).format('YYYY-MM-DD');
    //   params['end'] = moment(searchData.expend_range[1]).format('YYYY-MM-DD');
    // }
    return this._http.get<TimelineExpenditure>(analysisUrl+"/timeline/exp");
  }

  timelineProfit(): Observable<TimelineProfit> {
    // if (searchData.expend_range?.length > 1) {
    //   params['start'] = moment(searchData.expend_range[0]).format('YYYY-MM-DD');
    //   params['end'] = moment(searchData.expend_range[1]).format('YYYY-MM-DD');
    // }
    return this._http.get<TimelineProfit>(analysisUrl+"/timeline/profit");
  }
}
