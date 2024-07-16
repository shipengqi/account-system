---
title: chart-card
subtitle: 图表卡片
cols: 2
type: Chart
---

图表卡片，用于展示图表的卡片容器，可以方便的配合其它图表套件展示丰富信息。

## API

### chart-card

| 参数 | 说明 | 类型 | 默认值 |
|----|----|----|-----|
| `[title]` | 卡片标题 | `string,TemplateRef<void>` | - |
| `[avatar]` | 头像 | `string,TemplateRef<void>` | - |
| `[action]` | 卡片操作 | `string,TemplateRef<void>` | - |
| `[total]` | 数据总量（支持HTML） | `string` | - |
| `[footer]` | 卡片底部 | `string,TemplateRef<void>` | - |
| `[contentHeight]` | 内容区域高度（单位：`px`） | `string` | - |
| `[bordered]` | 是否显示边框 | `boolean` | `false` |


### Usage

```ts
import { Component } from '@angular/core';

import { G2CardModule } from 'chart/card';
import { TrendModule } from 'chart/trend';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-demo',
  template: `
    <chart-card
      [title]="'销售额'"
      [bordered]="true"
      [total]="'¥ 126,560.00'"
      footer="日访问量 12,423"
      contentHeight="46"
      [action]="action"
    >
      <ng-template #action>
        <i nz-tooltip nzTooltipTitle="指标说明" nz-icon nzType="info-circle"></i>
      </ng-template>
      周同比
      <trend flag="up" style="margin: 0 16px 0 8px; color: rgba(0,0,0,.85)">12%</trend>
      日环比
      <trend flag="down" style="margin: 0 0 0 8px; color: rgba(0,0,0,.85)">11%</trend>
    </chart-card>
  `,
  standalone: true,
  imports: [G2CardModule, NzToolTipModule, TrendModule]
})
export class DemoComponent {}
```

```ts
import { Component } from '@angular/core';

import { G2CardModule } from 'chart/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-demo',
  template: `
    <chart-card
      [title]="'移动指标'"
      [bordered]="true"
      [total]="'¥ 126,560.00'"
      footer="日访问量 12,423"
      [avatar]="avatar"
      [action]="action"
    >
      <ng-template #avatar><img style="width:56px; height: 56px" src="./assets/img/logo-color.svg" /></ng-template>
      <ng-template #action>
        <i nz-tooltip nzTooltipTitle="指标说明" nz-icon nzType="info-circle"></i>
      </ng-template>
    </chart-card>
  `,
  standalone: true,
  imports: [G2CardModule, NzToolTipModule, NzIconModule]
})
export class DemoComponent {}
```

```ts
import { Component } from '@angular/core';

import { G2CardModule } from 'chart/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-demo',
  template: `
    <chart-card [title]="'移动指标'" [bordered]="true" [total]="'¥ 126,560.00'" [avatar]="avatar" [action]="action">
      <ng-template #avatar><img style="width:56px; height: 56px" src="./assets/img/logo-color.svg" /></ng-template>
      <ng-template #action>
        <i nz-tooltip nzTooltipTitle="指标说明" nz-icon nzType="info-circle"></i>
      </ng-template>
    </chart-card>
  `,
  standalone: true,
  imports: [G2CardModule, NzToolTipModule, NzIconModule]
})
export class DemoComponent {}
```
