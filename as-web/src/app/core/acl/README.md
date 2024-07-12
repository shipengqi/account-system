# ACL

ACL 访问控制列表（Access Control List），基于角色权限的控制方式。

内部实际是一个 `ACLService` 它提供一套基于角色权限服务类。

## 使用

导入 `ACLModule`：

```typescript
import { ACLModule } from './core/acl';

@NgModule({
  imports: [
    ACLModule.forRoot({}) // ACLConfig
  ]
})
export class AppModule {}
```

`style.less` 中引入 ACL 样式：

```less
@import './core/acl/style/index.less';
```

`ACLService` 设置权限：

```typescript
export class AppComponent {

  constructor(
    private _acl: ACLService
  ) {
    _acl.setRole(['user1']);
    // or
    _acl.set({});
  }
}
```
### API

`ACLConfig`：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `[guard_url]` | `string` | 路由守卫失败后跳转 | `/403` |
| `[preCan]` | `(roleOrAbility: ACLCanType) => ACLType` | `can` 执行前回调 |	- |

`ACLService`：

| 方法 | 说明 |
| --- | --- |
| `[change]` | 监听 ACL 变更通知 |
| `[data]` | 获取所有 ACL 数据 |
| `setFull(val: boolean)` | 标识当前用户为全量，即不受限 |
| `set(value: ACLType)` | 设置当前用户角色或权限能力（会先清除所有） |
| `setRole(roles: string[])` | 设置当前用户角色（会先清除所有） |
| `setAbility(abilities: (number | string)[])` | 设置当前用户权限能力（会先清除所有） |
| `add(value: ACLType)` | 为当前用户增加角色或权限能力 |
| `attachRole(roles: string[])` | 为当前用户附加角色 |
| `attachAbility(abilities: (number | string)[])` | 为当前用户附加权限 |
| `removeRole(roles: string[])` | 为当前用户移除角色 |
| `removeAbility(abilities: (number | string)[])` | 为当前用户移除权限 |
| `can(roleOrAbility: ACLCanType)` | 当前用户是否有对应角色 |
| `canAbility(ability: ACLCanType)` | 当前用户是否有对应权限点 |

`ACLCanType`：

```typescript
type ACLCanType = number | number[] | string | string[] | ACLType
```

`ACLType`：

| 属性	 | 说明                                      | 类型                                                        | 默认值 |
| --- |-----------------------------------------|-----------------------------------------------------------|-----|
| `[role]` | `string[]`                              | 角色                                                        | -   |
| `[ability]` | `number[], string[]` | 权限点                                                       | 	-  |
| `[mode]` | `allOf, oneOf` | `allOf` 表示必须满足所有角色或权限点数组算有效 `oneOf` 表示只须满足角色或权限点数组中的一项算有效 | 	`oneOf`  |
| `[except]` | `boolean` | 是否取反，即结果为 `true` 时表示未授权                                   | 	`false`  |

## 粒度控制

很多时候需要对某个按钮进行权限控制，`acl` 指令，可以利用角色或权限点对某个按钮、表格、列表等元素进行权限控制。


```html
<!--按钮必须拥有 user 角色时才会显示-->
<button [acl]="'user'"></button>
<button *aclIf="'user'"></button>

<!--按钮必须拥有 user 或 manage 角色显示-->
<button [acl]="['user', 'manage']"></button>
<button *aclIf="['user', 'manage']"></button>

<!--按钮必须拥有 user 和 manage 角色显示-->
<button [acl]="{ role: ['user', 'manage'], mode: 'allOf' }"></button>
<button *aclIf="{ role: ['user', 'manage'], mode: 'allOf' }"></button>

<!--当拥有 user 角色显示文本框，未授权显示文本-->
<input nz-input *aclIf="'user'; else unauthorized">
<ng-template #unauthorized>{{user}}</ng-template>

<!--使用 except 反向控制，当未拥有 user 角色时显示-->
<ng-template [aclIf]="user" except>
  <input nz-input>
</ng-template>
```

### 权限点

```html
<!--按钮必须拥有 10 权限点显示-->
<button [acl]="10"></button>

<!--acl 指令为了能所传递的值是角色还是权限点，所以以 string 类型表示角色、number 类型表示权限点，若权限点为字符串，可使用以下写法-->
<button acl [acl-ability]="'USER-EDIT'"></button>
```

使用 `mode: 'allOf'` 表示必须同时拥有。

- `oneOf` 表示只须满足角色或权限点数组中的一项算有效（默认）
- `allOf` 表示必须满足所有角色或权限点数组算有效

```html
<!--按钮必须拥有 10 和 USER-EDIT 权限点时显示-->
<button [acl]="{ ability: [10, 'USER-EDIT'], mode: 'allOf' }"></button>
```

检查权限是通过 `can` 方法，通过全局配置 `acl.preCan` 方法，可以利用该方法来实现一个字符串区分角色或权限点。

```typescript
// global-config.module.ts

  acl: {
    preCan: (roleOrAbility) => {
      const str = roleOrAbility.toString();
      return str.startsWith('ability.') ? { ability: [ str ] } : null;
    }
  }
```

因此，当传递一个带有 `ability.` 开头的字符串会被认为这是一个权限点，例如：

```html
<button acl="ability.user.edit"></button>
```

### API

| 参数	                                   | 说明	        | 类型	                        | 默认值 |
|---------------------------------------|------------|----------------------------| --- |
| `[aclIf]`                             | 	`can` 方法参数体 | 	`ACLCanType`              | - |
|  `[aclIfThen]`                        | 已授权时显示模板   | `TemplateRef<void>` `null` | -                                   |      
| `[aclIfElse]`                         | 未授权时显示模板   | `TemplateRef<void>` `null` | - |    
| `[except]` | `未授权时显示` | `boolean` | `false` | 

### 原理

`[acl]` 默认会在目标元素上增加一个 `acl__hide` 样式，利用 `display: none` 来隐藏未授权元素，它是一个简单、又高效的方式。

以此相对应的 `*aclIf` 是一个结构型指令，它类似 `*ngIf` 在未授权时会不渲染该元素。为了保持简洁它并不支持 `acl-ability` 权限点配置。

## 路由守卫

路由守卫可以防止未授权用户访问页面。

路由守卫需要单独对每一个路由进行设置，很多时候这看起来很繁琐，acl 实现了通用守卫类 `ACLGuard`，可以在路由注册时透过简单的配置完成一些复杂的操作，支持 `Observable` 类型。

使用固定属性 `guard` 来指定 `ACLCanType` 参数，例如：

```typescript
const routes: Routes = [
  {
    path: 'auth',
    canActivate: [ ACLGuard ],
    data: { guard: 'user1' as ACLGuardType }
  },
  {
    path: 'auth',
    canActivate: [ ACLGuard ],
    data: {
      guard: {
        role: [ 'user1' ],
        ability: [ 10, 'USER-EDIT' ],
        mode: 'allOf'
      } as ACLGuardType,
      guard_url: '/no-permisseion'
    }
  },
  {
    path: 'obs',
    canActivate: [ ACLGuard ],
    data: {
      guard: ((_srv, _injector) => {
        return of('user');
      }) as ACLGuardFunctionType,
      guard_url: '/no-permisseion'
    }
  }
]
```

示例：
```typescript
import { of } from 'rxjs';
import { ACLGuard } from '@delon/acl';
const routes: Routes = [
  {
    path: 'guard',
    component: GuardComponent,
    children: [
      // 角色限定
      { path: 'auth', component: GuardAuthComponent, canActivate: [ ACLGuard ], data: { guard: 'user1' } },
      { path: 'admin', component: GuardAdminComponent, canActivate: [ ACLGuard ], data: { guard: 'admin' } }
    ],
    // 所有子路由有效
    canActivateChild: [ ACLGuard ],
    data: { guard: { role: [ 'user1' ], ability: [ 10, 'USER-EDIT' ], mode: 'allOf' } }
  },
  // 权限点限定
  { path: 'pro', loadChildren: './pro/pro.module#ProModule', canMatch: [ ACLGuard ], data: { guard: 1 } },
  // 或使用 Observable 实现更复杂的行为
  { path: 'pro', loadChildren: './pro/pro.module#ProModule', canMatch: [ ACLGuard ], data: { guard: of(false).pipe(map(v => 'admin')) } }
];
```
