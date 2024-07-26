import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject, OnDestroy,
  OnInit
} from '@angular/core';

import {NzMessageService} from "ng-zorro-antd/message";
import {G2BarData} from "@delon/chart/bar";
import {G2TimelineData, G2TimelineMap} from "@delon/chart/timeline";

import {DashboardService} from "../../shared/services/dashboard.service";
import {
  Overall,
  OverallGeneral,
  OverallRevenueAndPayroll,
  TimelineExpenditure, TimelineProfit,
  TimelineRevenueAndPayroll
} from "../../shared/model/dashboard";
import {TranslateService} from "@ngx-translate/core";
import {forkJoin} from "rxjs";
import {DriversService} from "../../shared/services/drivers.service";
import {IDriver, IVehicle} from "../../shared/model/model";
import {VehiclesService} from "../../shared/services/vehicles.service";
import moment from "moment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  loading = true;

  expenditureTabs: Array<{ key: string; show?: boolean }> = [{key: 'expenditure', show: true}, {key: 'e-details', show: false}];
  expenditureLineTitleMap: G2TimelineMap = {y1: ''};
  expenditureBarData: G2BarData[] = this.genData();
  expenditureLineData: G2TimelineData[] = this.genLineData();
  expenditureRankListData: Array<{ title: string; total: number }> = [];
  expenditureRangeDate: Date[] = [];
  expenditureChartLoading = false;

  revenueTabs: Array<{ key: string; show?: boolean }> = [{key: 'revenue', show: true}, {key: 'r-details', show: false}];
  revenueLineTitleMap: G2TimelineMap = {y1: ''};
  revenueBarData: G2BarData[] = [];
  revenueLineData: G2TimelineData[] = [];
  revenueRankListData: Array<{ title: string; total: number }> = [];
  revenueRangeDate: Date[] = [];
  revenueChartLoading = false;

  payrollTabs: Array<{ key: string; show?: boolean }> = [{key: 'payroll', show: true}, {key: 'p-details', show: false}];
  payrollLineTitleMap: G2TimelineMap = {y1: ''};
  payrollBarData: G2BarData[] = [];
  payrollLineData: G2TimelineData[] = this.genLineData();
  payrollRankListData: Array<{ title: string; total: number }> = [];
  payrollRangeDate: Date[] = [];
  payrollChartLoading = false;

  profitTabs: Array<{ key: string; show?: boolean }> = [{key: 'profit', show: true}, {key: 'pro-details', show: false}];
  profitLineTitleMap: G2TimelineMap = {y1: ''};
  profitBarData: G2BarData[] = this.genData();
  profitLineData: G2TimelineData[] = this.genLineData();
  profitRankListData: Array<{ title: string; total: number }> = [];
  profitRangeDate: Date[] = [];
  profitChartLoading = false;

  expendTypes = [
    {text: this._translate.instant('expenditure.toll'), value: 1},
    {text: this._translate.instant('expenditure.fuel'), value: 2},
    {text: this._translate.instant('expenditure.maintenance'), value: 3},
    {text: this._translate.instant('expenditure.weighbridge-fee'), value: 4},
    {text: this._translate.instant('expenditure.water-refilling-fee'), value: 5},
    {text: this._translate.instant('expenditure.other-fees'), value: 6},
  ];

  overall: Overall = {
    revpay: {
      total_revenue: 0,
      total_payroll: 0,
      cm_revenue: 0,
      cm_payroll: 0,
      lm_revenue: 100,
      lym_revenue: 100,
      lm_payroll: 100,
      lym_payroll: 100
    },
    exp: {
      total: 0,
      cm: 0,
      lm: 100,
      lym: 100
    },
    profit: {
      total: 0,
      cm: 0,
      lm: 100,
      lym: 100
    }
  };

  drivers: IDriver[] = [];
  driversMap: any = {};
  vehicles: IVehicle[] = [];
  vehiclesMap: any = {};

  constructor(
    private _dashboardSvc: DashboardService,
    private _message: NzMessageService,
    private _translate: TranslateService,
    private _vehiclesSvc: VehiclesService,
    private _driversSve: DriversService
  ) {}

  ngOnInit() {
    forkJoin([
      this._dashboardSvc.overallRevPay(),
      this._dashboardSvc.overallExp()
    ]).subscribe({
      next: (res) => {
        this.overall.revpay = res[0];
        this.overall.exp = res[1];
        this.overall.profit = this.calculateOverallProfit(res[0], res[1]);

        this.overall.revpay.m2m_revenue = this.calculateMM(this.overall.revpay.lm_revenue, this.overall.revpay.cm_revenue);
        this.overall.revpay.mom_revenue = this.calculateMM(this.overall.revpay.lym_revenue, this.overall.revpay.cm_revenue);
        this.overall.revpay.m2m_payroll = this.calculateMM(this.overall.revpay.lm_payroll, this.overall.revpay.cm_payroll);
        this.overall.revpay.mom_payroll = this.calculateMM(this.overall.revpay.lym_payroll, this.overall.revpay.cm_payroll);

        this.overall.exp.m2m = this.calculateMM(this.overall.exp.lm, this.overall.exp.cm);
        this.overall.exp.mom = this.calculateMM(this.overall.exp.lym, this.overall.exp.cm);

        this.overall.profit.m2m = this.calculateMM(this.overall.profit.lm, this.overall.profit.cm);
        this.overall.profit.mom = this.calculateMM(this.overall.profit.lym, this.overall.profit.cm);
      },
      error: (err) => {
        this._message.error(err.message);
      }
    });

    this.loading = true;
    forkJoin([
      this._vehiclesSvc.listAll(),
      this._driversSve.listAll(),
      this._dashboardSvc.timelineRevPay(),
      this._dashboardSvc.timelineExp(),
      this._dashboardSvc.timelineProfit()
    ]).subscribe({
      next: (res) => {
        this.vehicles = res[0].items;
        this.drivers = res[1].items;

        for (const v of this.vehicles) {
          this.vehiclesMap[`${v.id}`] = v.number;
        }
        for (const v of this.drivers) {
          this.driversMap[`${v.id}`] = v.name;
        }
        this.calculateVehiclesRevenueChartsData(res[2]);
        this.calculateDriversPayrollChartsData(res[2]);
        this.calculateExpenditureChartsData(res[3]);
        this.calculateProfitChartsData(res[4]);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this._message.error(err.message);
      }
    })
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.revenueTabs[0].show = false;
  }

  expenditureTabChange(idx: number): void {
    this.onTabChange(this.expenditureTabs, idx);
  }

  revenueTabChange(idx: number): void {
    this.onTabChange(this.revenueTabs, idx);
  }

  payrollTabChange(idx: number): void {
    this.onTabChange(this.payrollTabs, idx);
  }

  profitTabChange(idx: number): void {
    this.onTabChange(this.profitTabs, idx);
  }

  onRevenueChartSearch(): void {
    this.revenueChartLoading = true;
    this._dashboardSvc.timelineRevPay(this.revenueRangeDate).subscribe({
      next: (res) => {
        this.calculateVehiclesRevenueChartsData(res);
        this.revenueChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.revenueChartLoading = false;
        this._message.error(err.message);
      }
    })
  }
  onExpenditureChartSearch(): void {
    this.expenditureChartLoading = true;
    this._dashboardSvc.timelineExp(this.expenditureRangeDate).subscribe({
      next: (res) => {
        this.calculateExpenditureChartsData(res);
        this.expenditureChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.expenditureChartLoading = false;
        this._message.error(err.message);
      }
    })
  }
  onPayrollChartSearch(): void {
    this.payrollChartLoading = true;
    this._dashboardSvc.timelineRevPay(this.payrollRangeDate).subscribe({
      next: (res) => {
        this.calculateDriversPayrollChartsData(res);
        this.payrollChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.payrollChartLoading = false;
        this._message.error(err.message);
      }
    })
  }
  onProfitChartSearch(): void {
    this.profitChartLoading = true;
    this._dashboardSvc.timelineProfit(this.profitRangeDate).subscribe({
      next: (res) => {
        this.calculateProfitChartsData(res);
        this.profitChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.profitChartLoading = false;
        this._message.error(err.message);
      }
    })
  }

  formatPercent(n: number = 0): string {
    return n.toFixed(2);
  }

  formatTotal(n: number): string {
    if (n < 1000000) {
      return n.toString();
    }
    n = n / 10000;
    return n.toFixed(2) + this._translate.instant('analysis.ten-thousand');
  }

  calculateVehiclesRevenueChartsData(charsData: TimelineRevenueAndPayroll) {
    let rank: Array<{ title: string; total: number }> = [];
    let barData: G2BarData[] = [];
    let lineData: G2TimelineData[] = [];

    let vehiclesLineTitleMap: any = {};

    for (const bd in charsData.revenue_bar_data) {
      barData.push({
        x: bd,
        y: charsData.revenue_bar_data[bd]
      })
    }
    this.revenueBarData = barData.sort((d1, d2) => {
      return new Date(d1.x).getTime() - new Date(d2.x).getTime();
    });

    let titleNum = 1;
    for (const bd in charsData.vehicle_data) {
      vehiclesLineTitleMap[bd] = `y${titleNum}`;
      this.revenueLineTitleMap[`y${titleNum}`] = this.vehiclesMap[bd];
      titleNum ++;
      rank.push({
        title: this.vehiclesMap[bd],
        total: charsData.vehicle_data[bd]
      })
    }
    this.revenueRankListData = rank;

    for (const ld in charsData.revenue_line_data) {
      let vdata: any = {
        time: moment(new Date(ld)).endOf("month").valueOf(),
        y1: 0 // default 0, y1 is required
      }
      for (const tv in charsData.revenue_line_data[ld]) {
        vdata[vehiclesLineTitleMap[tv]] = charsData.revenue_line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.revenueLineData = lineData;
  }

  calculateDriversPayrollChartsData(charsData: TimelineRevenueAndPayroll) {
    let rank: Array<{ title: string; total: number }> = [];
    let barData: G2BarData[] = [];
    let lineData: G2TimelineData[] = [];

    let driversLineTitleMap: any = {};

    for (const bd in charsData.payroll_bar_data) {
      barData.push({
        x: bd,
        y: charsData.payroll_bar_data[bd]
      })
    }
    this.payrollBarData = barData.sort((d1, d2) => {
      return new Date(d1.x).getTime() - new Date(d2.x).getTime();
    });

    let titleNum = 1;
    for (const bd in charsData.driver_data) {
      driversLineTitleMap[bd] = `y${titleNum}`;
      this.payrollLineTitleMap[`y${titleNum}`] = this.driversMap[bd];
      titleNum ++;
      rank.push({
        title: this.driversMap[bd],
        total: charsData.driver_data[bd]
      })
    }
    this.payrollRankListData = rank;

    for (const ld in charsData.payroll_line_data) {
      let vdata: any = {
        time: moment(new Date(ld)).endOf("month").valueOf(),
        y1: 0 // default 0, y1 is required
      }
      for (const tv in charsData.payroll_line_data[ld]) {
        vdata[driversLineTitleMap[tv]] = charsData.payroll_line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.payrollLineData = lineData;
  }

  calculateExpenditureChartsData(charsData: TimelineExpenditure) {
    let rank: Array<{ title: string; total: number }> = [];
    let barData: G2BarData[] = [];
    let lineData: G2TimelineData[] = [];

    let vehiclesLineTitleMap: any = {};

    for (const bd in charsData.bar_data) {
      barData.push({
        x: bd,
        y: charsData.bar_data[bd]
      })
    }
    this.expenditureBarData = barData.sort((d1, d2) => {
      return new Date(d1.x).getTime() - new Date(d2.x).getTime();
    });

    let titleNum = 1;
    for (const bd in charsData.vehicle_data) {
      vehiclesLineTitleMap[bd] = `y${titleNum}`;
      this.expenditureLineTitleMap[`y${titleNum}`] = this.vehiclesMap[bd];
      titleNum ++;
      rank.push({
        title: this.vehiclesMap[bd],
        total: charsData.vehicle_data[bd]
      })
    }
    this.expenditureRankListData = rank;

    for (const ld in charsData.line_data) {
      let vdata: any = {
        time: moment(new Date(ld)).endOf("month").valueOf(),
        y1: 0 // default 0, y1 is required
      }
      for (const tv in charsData.line_data[ld]) {
        vdata[vehiclesLineTitleMap[tv]] = charsData.line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.expenditureLineData = lineData;
  }

  calculateProfitChartsData(charsData: TimelineProfit) {
    let rank: Array<{ title: string; total: number }> = [];
    let barData: G2BarData[] = [];
    let lineData: G2TimelineData[] = [];

    let vehiclesLineTitleMap: any = {};

    for (const bd in charsData.bar_data) {
      barData.push({
        x: bd,
        y: charsData.bar_data[bd],
        color: charsData.bar_data[bd] < 5 ? '#f50' : undefined
      })
    }
    this.profitBarData = barData.sort((d1, d2) => {
      return new Date(d1.x).getTime() - new Date(d2.x).getTime();
    });

    let titleNum = 1;
    for (const bd in charsData.vehicle_data) {
      vehiclesLineTitleMap[bd] = `y${titleNum}`;
      this.profitLineTitleMap[`y${titleNum}`] = this.vehiclesMap[bd];
      titleNum ++;
      rank.push({
        title: this.vehiclesMap[bd],
        total: charsData.vehicle_data[bd]
      })
    }
    this.profitRankListData = rank;

    for (const ld in charsData.line_data) {
      let vdata: any = {
        time: moment(new Date(ld)).endOf("month").valueOf(),
        y1: 0 // default 0, y1 is required
      }
      for (const tv in charsData.line_data[ld]) {
        vdata[vehiclesLineTitleMap[tv]] = charsData.line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.profitLineData = lineData;
  }

  calculateMM(lm: number, cm: number): number {
    let percent = 100
    if (lm === 0 && cm < 0) {
      return -100
    }
    if (lm === 0 && cm > 0) {
      return 100
    }
    percent = (cm - lm) / lm * 100
    return percent
  }

  private calculateOverallProfit(revpay: OverallRevenueAndPayroll, exp: OverallGeneral): OverallGeneral {
    let profit: OverallGeneral = {
      total: 0,
      cm: 0,
      lm: 100,
      lym: 100
    }
    profit.total = revpay.total_revenue - revpay.total_payroll - exp.total;
    profit.cm = revpay.cm_revenue - revpay.cm_payroll - exp.cm;
    profit.lm = revpay.lm_revenue - revpay.lm_payroll - exp.lm;
    profit.lym = revpay.lym_revenue - revpay.lym_payroll - exp.lym;

    return profit;
  }

  private onTabChange(tabs: Array<{ key: string; show?: boolean }>, idx: number): void {
    if (!tabs[idx].show) {
      tabs[idx].show = true;
      for (let i = 0; i < tabs.length; i++) {
        if (i === idx) {
          continue;
        }
        tabs[i].show = false;
      }
      this.cdr.detectChanges();
    }
  }

  private genData(): G2BarData[] {
    return new Array(12).fill({}).map((_i, idx) => ({
      x: `${idx + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200,
      color: idx > 5 ? '#f50' : undefined
    }));
  }

  private genLineData(): G2TimelineData[] {
    let data = []
    for (let i = 0; i < 20; i += 1) {
      data.push({
        time: new Date().getTime() + 1000 * 60 * 30 * i,
        y1: Math.floor(Math.random() * 100) + 1000,
        y2: Math.floor(Math.random() * 100) + 10
      });
    }
    return data;
  }
}
