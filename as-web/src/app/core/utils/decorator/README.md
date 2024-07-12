# Decorators

## @ZoneOutside

被装饰的方法会运行在 `runOutsideAngular` 内。

```typescript
class MockClass {
  constructor(public ngZone: NgZone) {}

  @ZoneOutside()
  run(): void {}
}
```

## @ZoneRun

被装饰的方法会运行在 `run` 内。

```typescript
class MockClass {
  constructor(public ngZone: NgZone) {}

  @ZoneRun()
  run(): void {}
}
```
