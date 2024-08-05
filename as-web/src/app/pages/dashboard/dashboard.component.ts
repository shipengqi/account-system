import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';

import {forkJoin} from "rxjs";
import moment from "moment";
import {TranslateService} from "@ngx-translate/core";
import {G2BarData} from "@delon/chart/bar";
import {G2PieClickItem, G2PieData} from "@delon/chart/pie";
import {G2TimelineData, G2TimelineMap} from "@delon/chart/timeline";

import {
  Overall,
  OverallGeneral,
  OverallRevenueAndPayroll,
  TimelineExpenditure,
  TimelineProfit,
  TimelineRevenueAndPayroll
} from "../../shared/model/dashboard";
import {IDriver, IVehicle} from "../../shared/model/model";
import {DriversService} from "../../shared/services/drivers.service";
import {VehiclesService} from "../../shared/services/vehicles.service";
import {DashboardService} from "../../shared/services/dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  overallLoading = true;
  timelineLoading = true;

  pieChartDetailVisible = false;
  pieChartDetailTitle = '';
  pieChartDetailListData: any = [];
  overallPieTotal = 0;
  overallPieData: G2PieData[] = [];
  expenditurePieTotal = 0;
  expenditurePieData: G2PieData[] = [];

  expenditureTabs: Array<{ key: string; show?: boolean }> = [{key: 'expenditure', show: true}, {key: 'e-details', show: false}];
  expenditureBarData: G2BarData[] = [];
  expenditureLineData: G2TimelineData[] = [];
  expenditureRankListData: Array<{ title: string; total: number }> = [];
  expenditureRangeDate: Date[] = [];
  expenditureSelectedVehicles: number[] = [];
  expenditureChartLoading = false;
  expLineTitleMap: G2TimelineMap = {y1: ''};
  expVehiclesIdToLineTitleMap: any = {};
  expLineMaxAxis = 2;

  revenueTabs: Array<{ key: string; show?: boolean }> = [{key: 'revenue', show: true}, {key: 'r-details', show: false}];
  revenueBarData: G2BarData[] = [];
  revenueLineData: G2TimelineData[] = [];
  revenueRankListData: Array<{ title: string; total: number }> = [];
  revenueRangeDate: Date[] = [];
  revenueSelectedVehicles: number[] = [];
  searchExpenditureType = -1;
  revenueChartLoading = false;
  revenueLineTitleMap: G2TimelineMap = {y1: ''};
  revenueVehiclesIdToLineTitleMap: any = {};
  revenueLineMaxAxis = 2;

  payrollTabs: Array<{ key: string; show?: boolean }> = [{key: 'payroll', show: true}, {key: 'p-details', show: false}];
  payrollBarData: G2BarData[] = [];
  payrollLineData: G2TimelineData[] = [];
  payrollRankListData: Array<{ title: string; total: number }> = [];
  payrollRangeDate: Date[] = [];
  payrollSelectedDrivers: number[] = [];
  payrollChartLoading = false;
  payrollLineTitleMap: G2TimelineMap = {y1: ''};
  payrollDriversIdToLineTitleMap: any = {};
  payrollLineMaxAxis = 2;

  profitTabs: Array<{ key: string; show?: boolean }> = [{key: 'profit', show: true}, {key: 'pro-details', show: false}];
  profitBarData: G2BarData[] = [];
  profitLineData: G2TimelineData[] = [];
  profitRankListData: Array<{ title: string; total: number }> = [];
  profitRangeDate: Date[] = [];
  profitSelectedVehicles: number[] = [];
  profitChartLoading = false;
  profitLineTitleMap: G2TimelineMap = {y1: ''};
  profitVehiclesIdToLineTitleMap: any = {};
  profitLineMaxAxis = 2;

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
      lym: 100,
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
    private _translate: TranslateService,
    private _vehiclesSvc: VehiclesService,
    private _driversSve: DriversService,
  ) {}

  ngOnInit() {
    this.overallLoading = true;
    this.timelineLoading = true;
    forkJoin([
      this._vehiclesSvc.listAll(),
      this._driversSve.listAll()
    ]).subscribe({
      next: (res) => {
        this.vehicles = res[0].items;
        this.drivers = res[1].items;

        // this timeline chart can only be set for 5 y-axis
        let vehicleIds = this.vehicles.map(v => v.id).slice(0, 5);
        let driverIds = this.drivers.map(v => v.id).slice(0, 5);
        const overalls = forkJoin([
          this._dashboardSvc.overallRevPay(),
          this._dashboardSvc.overallExp()
        ]);
        const timelines = forkJoin([
          this._dashboardSvc.timelineRev(vehicleIds),
          this._dashboardSvc.timelinePay(driverIds),
          this._dashboardSvc.timelineExp(vehicleIds),
          this._dashboardSvc.timelineProfit(vehicleIds)
        ]);

        overalls.subscribe({
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

            this.overallPieData = this.calculateOverallPieChartData();
            this.expenditurePieData = this.calculateExpenditurePieChartData(this.overall.exp.cm_categorize);

            this.overallLoading = false;
          },
          error: () => {
            this.overallLoading = false;
          }
        });

        timelines.subscribe({
          next: (res) => {
            for (const v of this.vehicles) {
              this.vehiclesMap[`${v.id}`] = v.number;
            }

            for (const v of this.drivers) {
              this.driversMap[`${v.id}`] = v.name;
            }
            this.setRevLineData(vehicleIds);
            this.setExpLineData(vehicleIds);
            this.setPayrollLineData(driverIds);
            this.setProfitLineData(vehicleIds);
            this.calculateVehiclesRevenueChartsData(res[0]);
            this.calculateDriversPayrollChartsData(res[1]);
            this.calculateExpenditureChartsData(res[2]);
            this.calculateProfitChartsData(res[3]);
            this.timelineLoading = false;
          },
          error: (err) => {
            this.timelineLoading = false;
          }
        })
      },
      error: (err) => {
        this.overallLoading = false;
        this.timelineLoading = false;
      }
    });
  }

  handlePieChartClick(data: G2PieClickItem, isExpPieChart: boolean = false): void {
    this.pieChartDetailVisible = true;
    let listData = [];
    if (data.item['extra']) {
      for (const i in data.item['extra']) {
        listData.push({
          title: data.item['driverItem'] === true ? this.driversMap[i] : this.vehiclesMap[i],
          percent: data.item['extra'][i]/data.item.y*100,
          value: data.item['extra'][i]
        })
      }
    }
    let suffix = this._translate.instant('global.detail');
    if (isExpPieChart) {
      suffix = this._translate.instant('analysis.expenditure-details');
    }
    this.pieChartDetailTitle = data.item.x + suffix;
    this.pieChartDetailListData = listData;
  }

  handlePieValueFormat(val: number): string {
    return `&yen ${val.toFixed(2)}`;
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

  resetRevLineData() {
    this.revenueLineTitleMap = {y1: ''};
    this.revenueVehiclesIdToLineTitleMap = {};
    this.revenueLineMaxAxis = 2;
  }

  setRevLineData(vehicles: number[]) {
    this.resetRevLineData();

    this.revenueLineMaxAxis = vehicles.length;
    for (let i = 0; i < vehicles.length; i ++) {
      this.revenueLineTitleMap[`y${i+1}`] = this.vehiclesMap[vehicles[i]];
      this.revenueVehiclesIdToLineTitleMap[vehicles[i]] = `y${i+1}`;
    }
  }

  resetExpLineData() {
    this.expLineTitleMap = {y1: ''};
    this.expVehiclesIdToLineTitleMap = {};
    this.expLineMaxAxis = 2;
  }

  setExpLineData(vehicles: number[]) {
    this.resetExpLineData();

    this.expLineMaxAxis = vehicles.length;
    for (let i = 0; i < vehicles.length; i ++) {
      this.expLineTitleMap[`y${i+1}`] = this.vehiclesMap[vehicles[i]];
      this.expVehiclesIdToLineTitleMap[vehicles[i]] = `y${i+1}`;
    }
  }

  resetPayrollLineData() {
    this.payrollLineTitleMap = {y1: ''};
    this.payrollDriversIdToLineTitleMap = {};
    this.payrollLineMaxAxis = 2;
  }

  setPayrollLineData(drivers: number[]) {
    this.resetPayrollLineData();

    this.payrollLineMaxAxis = drivers.length;
    for (let i = 0; i < drivers.length; i ++) {
      this.payrollLineTitleMap[`y${i+1}`] = this.driversMap[drivers[i]];
      this.payrollDriversIdToLineTitleMap[drivers[i]] = `y${i+1}`;
    }
  }

  resetProfitLineData() {
    this.profitLineTitleMap = {y1: ''};
    this.profitVehiclesIdToLineTitleMap = {};
    this.profitLineMaxAxis = 2;
  }

  setProfitLineData(vehicles: number[]) {
    this.resetProfitLineData();

    this.profitLineMaxAxis = vehicles.length;
    for (let i = 0; i < vehicles.length; i ++) {
      this.profitLineTitleMap[`y${i+1}`] = this.vehiclesMap[vehicles[i]];
      this.profitVehiclesIdToLineTitleMap[vehicles[i]] = `y${i+1}`;
    }
  }

  onRevenueChartSearch(): void {
    this.revenueChartLoading = true;
    let vehicles = this.revenueSelectedVehicles.length > 0 ?
      this.revenueSelectedVehicles : this.vehicles.map(v => v.id).slice(0, 5);
    this.setRevLineData(vehicles);

    this._dashboardSvc.timelineRev(vehicles, this.revenueRangeDate).subscribe({
      next: (res) => {
        this.calculateVehiclesRevenueChartsData(res);
        this.revenueChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.revenueChartLoading = false;
      }
    })
  }
  onExpenditureChartSearch(): void {
    this.expenditureChartLoading = true;
    let vehicles = this.expenditureSelectedVehicles.length > 0 ?
      this.expenditureSelectedVehicles : this.vehicles.map(v => v.id).slice(0, 5);
    this.setExpLineData(vehicles);

    this._dashboardSvc.timelineExp(vehicles, this.searchExpenditureType, this.expenditureRangeDate).subscribe({
      next: (res) => {
        this.calculateExpenditureChartsData(res);
        this.expenditureChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.expenditureChartLoading = false;
      }
    })
  }
  onPayrollChartSearch(): void {
    this.payrollChartLoading = true;
    let drivers = this.payrollSelectedDrivers.length > 0 ?
      this.payrollSelectedDrivers : this.drivers.map(v => v.id).slice(0, 5);
    this.setPayrollLineData(drivers);

    this._dashboardSvc.timelinePay(drivers, this.payrollRangeDate).subscribe({
      next: (res) => {
        this.calculateDriversPayrollChartsData(res);
        this.payrollChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.payrollChartLoading = false;
      }
    })
  }
  onProfitChartSearch(): void {
    this.profitChartLoading = true;
    let vehicles = this.profitSelectedVehicles.length > 0 ?
      this.profitSelectedVehicles : this.vehicles.map(v => v.id).slice(0, 5);
    this.setProfitLineData(vehicles);

    this._dashboardSvc.timelineProfit(vehicles, this.profitRangeDate).subscribe({
      next: (res) => {
        this.calculateProfitChartsData(res);
        this.profitChartLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.profitChartLoading = false;
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

    for (const bd in charsData.revenue_bar_data) {
      barData.push({
        x: bd, // time
        y: charsData.revenue_bar_data[bd] // value
      })
    }
    this.revenueBarData = barData.sort((d1, d2) => {
      return new Date(d1.x).getTime() - new Date(d2.x).getTime();
    });

    for (const bd in charsData.vehicle_data) {
      rank.push({
        title: this.vehiclesMap[bd],
        total: charsData.vehicle_data[bd]
      })
    }
    this.revenueRankListData = rank;

    for (const ld in charsData.revenue_line_data) {
      let vdata = this.genLineInitData(ld, Object.keys(this.revenueLineTitleMap).length);
      for (const tv in charsData.revenue_line_data[ld]) {
        vdata[this.revenueVehiclesIdToLineTitleMap[tv]] = charsData.revenue_line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.revenueLineData = lineData;
  }

  calculateDriversPayrollChartsData(charsData: TimelineRevenueAndPayroll) {
    let rank: Array<{ title: string; total: number }> = [];
    let barData: G2BarData[] = [];
    let lineData: G2TimelineData[] = [];

    for (const bd in charsData.payroll_bar_data) {
      barData.push({
        x: bd,
        y: charsData.payroll_bar_data[bd]
      })
    }
    this.payrollBarData = barData.sort((d1, d2) => {
      return new Date(d1.x).getTime() - new Date(d2.x).getTime();
    });
    for (const bd in charsData.driver_data) {
      rank.push({
        title: this.driversMap[bd],
        total: charsData.driver_data[bd]
      })
    }
    this.payrollRankListData = rank;

    for (const ld in charsData.payroll_line_data) {
      let vdata = this.genLineInitData(ld, Object.keys(this.payrollLineTitleMap).length);
      for (const tv in charsData.payroll_line_data[ld]) {
        vdata[this.payrollDriversIdToLineTitleMap[tv]] = charsData.payroll_line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.payrollLineData = lineData;
  }

  calculateExpenditureChartsData(charsData: TimelineExpenditure) {
    let rank: Array<{ title: string; total: number }> = [];
    let barData: G2BarData[] = [];
    let lineData: G2TimelineData[] = [];

    for (const bd in charsData.bar_data) {
      barData.push({
        x: bd,
        y: charsData.bar_data[bd]
      })
    }
    this.expenditureBarData = barData.sort((d1, d2) => {
      return new Date(d1.x).getTime() - new Date(d2.x).getTime();
    });

    for (const bd in charsData.vehicle_data) {
      rank.push({
        title: this.vehiclesMap[bd],
        total: charsData.vehicle_data[bd]
      })
    }
    this.expenditureRankListData = rank;

    for (const ld in charsData.line_data) {
      let vdata = this.genLineInitData(ld, Object.keys(this.expLineTitleMap).length);
      for (const tv in charsData.line_data[ld]) {
        vdata[this.expVehiclesIdToLineTitleMap[tv]] = charsData.line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.expenditureLineData = lineData;
  }

  calculateProfitChartsData(charsData: TimelineProfit) {
    let rank: Array<{ title: string; total: number }> = [];
    let barData: G2BarData[] = [];
    let lineData: G2TimelineData[] = [];

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

    for (const bd in charsData.vehicle_data) {
      rank.push({
        title: this.vehiclesMap[bd],
        total: charsData.vehicle_data[bd]
      })
    }
    this.profitRankListData = rank;

    for (const ld in charsData.line_data) {
      let vdata = this.genLineInitData(ld, Object.keys(this.profitLineTitleMap).length);
      for (const tv in charsData.line_data[ld]) {
        vdata[this.profitVehiclesIdToLineTitleMap[tv]] = charsData.line_data[ld][tv];
      }
      lineData.push(vdata);
    }
    this.profitLineData = lineData;
  }

  private calculateOverallPieChartData(): G2PieData[] {
    this.overallPieTotal = this.overall.revpay.cm_revenue;
    let profitExtra: any = {};
    for (const v of this.vehicles) {
      if (!profitExtra[v.id]) {
        profitExtra[v.id] = 0;
      }
      // @ts-ignore
      const rev = this.overall.revpay.cm_revenue_categorize[v.id] || 0;
      // @ts-ignore
      const pay = this.overall.revpay.cm_vehicle_pay_categorize[v.id] || 0;
      // @ts-ignore
      const exp = this.overall.exp.cm_vehicle_total_data[v.id] || 0;
      profitExtra[v.id] = rev - pay - exp;
    }
    return [{
      x: this._translate.instant('analysis.profit'),
      y: this.overall.profit.cm,
      extra: profitExtra,
    }, {
      x: this._translate.instant('analysis.expenditure'),
      y: this.overall.exp.cm,
      extra: this.overall.exp.cm_vehicle_total_data || {},
    }, {
      x: this._translate.instant('analysis.payroll'),
      y: this.overall.revpay.cm_payroll,
      extra: this.overall.revpay.cm_payroll_categorize || {},
      driverItem: true
    }];
  }

  private calculateExpenditurePieChartData(cmtypes?: {
    [key: number]: {
      total: number;
      vehicle_total_data: {
        [key: number]: number
      };
    }
  }): G2PieData[] {
    if (!cmtypes) {
      return [];
    }
    let pieData: G2PieData[] = [];
    this.expenditurePieTotal =  this.overall.exp.cm;
    for (const t of this.expendTypes) {
      pieData.push({
        x: t.text,
        y: cmtypes[t.value]?.total || 0,
        extra: cmtypes[t.value]?.vehicle_total_data || {}
      })
    }
    return pieData;
  }

  calculateMM(lm: number, cm: number): number {
    let percent = 100
    if (lm === 0 && cm < 0) {
      return -100
    }
    if (lm === 0 && cm > 0) {
      return 100
    }
    if (lm === 0 && cm == 0) {
      return 0
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

    profit.total = parseFloat((revpay.total_revenue - revpay.total_payroll - exp.total).toFixed(2));
    profit.cm = parseFloat((revpay.cm_revenue - revpay.cm_payroll - exp.cm).toFixed(2));
    profit.lm = parseFloat((revpay.lm_revenue - revpay.lm_payroll - exp.lm).toFixed(2));
    profit.lym = parseFloat((revpay.lym_revenue - revpay.lym_payroll - exp.lym).toFixed(2));

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

  private genLineInitData(timestr: string, ylength: number): any {
    let ldata: any = {
      time: moment(new Date(timestr)).endOf("month").valueOf(),
      y1: 0 // default 0, y1 is required
    }
    // y length should equal to the titleMap length of g2-timeline component
    for (let i = 2; i <= ylength; i += 1) {
      ldata[`y${i}`] = 0
    }
    return ldata;
  }
}
