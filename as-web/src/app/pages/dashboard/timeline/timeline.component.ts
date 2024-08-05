import {ChangeDetectorRef, Component, Input, TemplateRef} from '@angular/core';

import {G2BarData} from "@delon/chart/bar";
import {G2TimelineData, G2TimelineMap} from "@delon/chart/timeline";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.less'
})
export class TimelineComponent {
  @Input() extra?: TemplateRef<any>;
  @Input() loading: boolean = true;
  @Input() barData: G2BarData[] = [];
  @Input() lineData: G2TimelineData[] = [];
  @Input() rankListData: Array<{ title: string; total: number }> = [];
  @Input() lineTitleMap: G2TimelineMap = {y1: ''};
  @Input() lineMaxAxis = 2;
  @Input() barTabTitle: string = '';
  @Input() barTabSubTitle: string = '';
  @Input() timelineTabTitle: string = '';
  @Input() timelineTabSubTitle: string = '';
  @Input() rankListTitle: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  tabs: Array<{ key: string; show?: boolean }> = [{key: 'bar', show: true}, {key: 'timeline', show: false}];

  onTabChange(idx: number): void {
    if (!this.tabs[idx].show) {
      this.tabs[idx].show = true;
      for (let i = 0; i < this.tabs.length; i++) {
        if (i === idx) {
          continue;
        }
        this.tabs[i].show = false;
      }
      this.cdr.detectChanges();
    }
  }
}
