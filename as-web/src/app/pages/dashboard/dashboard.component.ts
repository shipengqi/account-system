import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {G2BarData} from "@delon/chart/bar";
import {G2TimelineData} from "@delon/chart/timeline";
import {NzTabComponent} from "ng-zorro-antd/tabs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  dateRange: Date[] = [];
  loading = false;
  dateRangeTypes = ['month', 'year'];
  dateRangeType = 'year';
  expenditureBarData: G2BarData[] = this.genData();
  expenditureLineData: G2TimelineData[] = this.genLineData();

  expenditureTabs: Array<{ key: string; show?: boolean }> = [{ key: 'revenue', show: true }, { key: 'details', show: false }];
  rankingListData: Array<{ title: string; total: number }> = Array(7)
    .fill({})
    .map((_, i) => {
      return {
        title: '',
        total: 323234
      };
    });

  ngOnInit() {

  }

  setDate(type: string): void {
    // this.dateRange = getTimeDistance(type as NzSafeAny);
    this.dateRangeType = type;
    setTimeout(() => this.cdr.detectChanges());
  }

  expenditureTabChange(idx: number): void {
    if (!this.expenditureTabs[idx].show) {
      this.expenditureTabs[idx].show = true;
      for (let i = 0; i < this.expenditureTabs.length; i ++) {
        if (i === idx) { continue; }
        this.expenditureTabs[i].show = false;
      }
      // this.expenditureLineData = this.genLineData();
      this.cdr.detectChanges();
    }
    // this.expenditureLineData = this.genLineData();
    // this.cdr.detectChanges();
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
