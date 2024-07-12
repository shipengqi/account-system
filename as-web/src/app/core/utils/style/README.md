# Style Utils

## updateHostClass

更新宿主组件样式 `class`：

```typescript
updateHostClass(
  this.el.nativeElement,
  this.renderer,
  {
    [ 'classname' ]: true,
    [ 'classname' ]: this.type === '1',
    [ this.cls ]: true,
    [ `a-${this.cls}` ]: true
  }
)
```

## preloaderFinished

用于移除首屏加载。
