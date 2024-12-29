---
title: Store
---


`StoreService` 通常用来把一些远程数据缓存在内存、`SessionStorage` 或 `localStorage` 中，可以减少 Http 请求的成本。

## `StoreService` 参数

| 成员           | 类型 | 默认值  | 说明                                                                     |
|-------------|----|------|------------------------------------------------------------------------|
| `[type]`    | `'mem' \| 'ss' \| 'ls'` | `'mm'` | 设置全局默认的存储类型，'mem' 表示内存，'ls' 表示 `localStorage`，'ss' 表示 `sessionStorage` |


## API

### set()

| 参数名       | 类型                                 | 描述               |
|-----------|------------------------------------|------------------|
| `key`     | `string`                           | 缓存唯一标识符          |
| `data`    | `any                               | Observable<any>` | 缓存数据源，数据源为 `Observable` 时，依然返回 `Observable`，否则返回 `void` |
| `options` | `{ type?: 'mem' \| 'ss' \| 'ls' }` | `type` 存储类型，'mem' 表示内存，'ls' 表示 `localStorage`，'ss' 表示 `sessionStorage` |

### get()

| 参数名 | 类型            | 描述 |
| ----- |---------------| --- |
| `key` | `string`      | 缓存唯一标识符 |
| `options` | `{ type?: 'mem' \| 'ss' \| 'ls' }` | `type` 存储类型，'mem' 表示内存，'ls' 表示 `localStorage`，'ss' 表示 `sessionStorage` |


### tryGet()

获取缓存，若不存在则设置缓存对象，参数等同 `set()`。

### has()

是否存在缓存 `key`。

### remove()

移除缓存 `key`。

### clear()

清空所有缓存。

## `get` 和 `tryGet` 的区别

本质都是获取并返回缓存数据，`tryGet` 会在没有缓存的情况下设置缓存对象。

## async 管道

RxJS 和 `async` 管道二者的配合可以帮助我们非常友好的使用缓存数据，例如：

```ts
@Component({
  template: `
    @for (unit of units | async; track $index) {
      <li>{{unit}}</li>
    }`
})
export class Component {
  units: this.srv.get('/data/unit')
}
```
