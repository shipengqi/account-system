# Core

## Layout 使用

### 1、导入样式

在 `src/styles.less` 引入：

```less
@import ~"ng-zorro-antd/ng-zorro-antd.less";
@import ~"/core/layout/style/index.less";
```

### 2、导入 assets

在 `angular.json` 添加：

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "*.json",
    "input": "./src/app/core/assets/i18n/",
    "output": "./assets/core/i18n"
  }
],
```

在 `app.module.ts` 文件中修改 `HttpLoaderFactory`：

```typescript
export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    {prefix: './assets/i18n/', suffix: '.json'},
    {prefix: './assets/core/i18n/', suffix: '.json'},
  ]);
}
```

### 3、使用 `app-layout` 组件

在 `src/app/basic.component.ts` 中创建一个新的布局：

```typescript
import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";

import {LayoutOptions} from "./core/layout/types";
import {HeaderNavItem} from "./core/layout/widgets/header-nav/types";
import {NoticeListItem, NoticeSelect} from "./core/layout/widgets/header-notify/types";

@Component({
  selector: 'app-layout-basic',
  template: `
    <app-layout [options]="options"
                [content]="contentTmpl">
      <app-layout-header-item direction="left">
        <app-header-nav [items]="headerNavs"></app-header-nav>
      </app-layout-header-item>
      <app-layout-header-item direction="right" hidden="mobile">
        <app-header-notify
          [data]="noticeData"
          [count]="noticeCount"
          [loading]="noticeLoading"
          (select)="noticeSelect($event)"
          (clear)="noticeClear($event)"></app-header-notify>
      </app-layout-header-item>
      <app-layout-header-item direction="right">
        <app-header-user></app-header-user>
      </app-layout-header-item>
      <ng-template #contentTmpl>
        <router-outlet></router-outlet>
      </ng-template>
    </app-layout>
  `,
})
export class BasicComponent implements OnInit {
  options: LayoutOptions = {
    // logoUrl: 'https://example.com/logo-full.svg',
    logoText: 'example',
    logoFixWidth: 80,
    siderCollapsible: true,
    hideSider: true,
  };

  // 配置 heaer 导航栏
  headerNavs: HeaderNavItem[] = [
    {
      routerLink: '/organizations',
      name: 'org.nav-title',
    },
    {
      routerLink: '/applications',
      name: 'app.nav-title'
    }
  ]

  noticeData: NoticeListItem[] = [
    {
      description: 'Please tell me what happened in a few words, don\'t go into details.',
      extra: 'Pending review',
    },
    {
      title: "Lucy",
      description: 'Please tell me what happened in a few words, don\'t go into details.',
      datetime: '8 days',
      extra: 'testing',
      avatarColor: '#7265e6',
      extraColor: '#ffbf00',
    },
    {
      avatar: 'https://ng-alain.surge.sh/assets/tmp/img/3.png',
      description: 'Please tell me what happened in a few words, don\'t go into details.',
      extra: 'Pending review',
      extraColor: '#ffbf00',
    },
    {
      avatarIcon: 'user',
      description: 'Please tell me what happened in a few words, don\'t go into details.',
      datetime: '8 days',
      avatarColor: '#f56a00',
    }
  ];
  noticeCount = 5;
  noticeLoading = true;

  constructor(private _msg: NzMessageService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.noticeLoading = false;
    }, 2000)
  }

  noticeClear(type: string): void {
    this._msg.success(`清空了 ${type}`);
  }

  noticeSelect(res: NoticeSelect): void {
    this._msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
  }
}
```

### API

#### app-layout

| 成员 | 说明     | 类型 | 默认值 |
|----|--------|----|-----|
| `[options]` | 选项     | `LayoutOptions` | `-` |
| `[sider]` | 自定义侧边菜单 | `TemplateRef<void>` | `-` |
| `[sideMenus]` | 默认侧边菜单 | `SideMenuItem[]` | `-` |
| `[content]` | 内容信息   | `TemplateRef<void>` | `-` |

TODO:

| 成员 | 说明 | 类型 | 默认值 |
|----|----|----|-----|
| `[customError]` | 自定义异常路由错误消息，当 `null` 时表示不显示错误消息 | `string, null` | `Could not load ${evt.url} route` |

#### LayoutOptions

| 成员                   | 说明               | 类型 | 默认值 |
|----------------------|------------------|----|-----|
| `[logo]`             | 自定义 Logo 区域      | `TemplateRef<void>` | - |
| `[logoUrl]`          | Logo 地址          | `string` | `./assets/logo-full.svg` |
| `[logoFixWidth]`     | 指定固定 Logo 宽度     | `number` | `-` |
| `[logoLink]`         | 指定 Logo 路由地址     | `string` | `/` |
| `[logoText]`         | 指定 Logo 标题       | `string` | `-` |
| `[logoHidden]`       | 隐藏 Logo             | `pc, mobile, none` | `nones` |
| `[hideSider]`        | 隐藏侧边栏            | `boolean` | `false` |
| `[siderCollapsible]` | 是否在侧边栏底部显示菜单折叠按钮 | `boolean` | `false` |


### app-layout-header

| 成员          | 说明 | 类型 | 默认值  |
|-------------|----|----|------|
| `[options]` | 隐藏行为 | `LayoutOptions` | `-`  |
| `[items]`   | 方向 | `QueryList<LayoutHeaderItemComponent>` | `[]` |

### app-layout-header-item

| 成员 | 说明 | 类型 | 默认值 |
|----|----|----|-----|
| `[hidden]` | 隐藏行为 | `pc, mobile, none` | `nones` |
| `[direction]` | 方向 | `left, middle, right` | `right` |

### app-layout-sider

默认侧边菜单。

| 成员              | 说明           | 类型               | 默认值  |
|-----------------|--------------|------------------|------|
| `[collapsed]`   | 折叠行为         | `boolean`        | `nones` |
| `[collapsible]` | 是否在侧边栏底部显示菜单折叠按钮 | `boolean`        | `false` |
| `[menus]` | 侧边栏菜单 | `SideMenuItem[]` | `[]` |


## Exception

[Exception 使用](./exception/README.md).

## Passport

[Passport 使用](./passport/README.md).

## Utils

- [Browser Utils](./utils/browser/README.md)
- [Decorators](./utils/decorator/README.md)
- [Form Utils](./utils/form/README.md)
- [Format Utils](./utils/format/README.md)
- [LazyService](./utils/lazy/README.md)
- [Style Utils](./utils/style/README.md)
- [Other Utils](./utils/other/README.md)

## Ellipsis 指令

[Ellipsis 指令使用](./ellipsis/README.md).

## Download File 指令

[Download File 指令使用](./down-file/README.md).

## Xlsx 指令

[Xlsx 指令使用](./xlsx/README.md).

### HTTP Interceptor

`SimpleInterceptor` 用于自动为请求添加 token 参数的拦截器。
`JWTInterceptor` 是一个标准 JWT 规范的 `SimpleInterceptor`

### Auth

### ACL

[ACL 使用](./acl/README.md).

### Mock

### Cache

把一些远程数据缓存在内存或 `localStorage` 持久化，目的是为了减少 Http 请求的成本；这样的数据通常是字典、城市数据等。

### SettingService


- https://ng-alain.com/cache/getting-started/zh
