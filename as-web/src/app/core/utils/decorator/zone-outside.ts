import type { NzSafeAny } from 'ng-zorro-antd/core/types';

type DecoratorType = (target: unknown, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

export interface ZoneOptions {
  ngZoneName?: string;
}

function makeFn(type: 'runOutsideAngular' | 'run', options?: ZoneOptions): DecoratorType {
  return (_, __, descriptor) => {
    const source = descriptor.value;
    descriptor.value = function (...args: NzSafeAny[]): () => void {
      const that = this as NzSafeAny;
      const zone = that[options?.ngZoneName || 'ngZone'];
      if (!zone) {
        return source.call(this, ...args);
      }
      let res: NzSafeAny;
      zone[type](() => {
        res = source.call(this, ...args);
      });
      return res;
    }
    return descriptor;
  };
}

/**
 * The decoration method runs in `runOutsideAngular`
 *
 * 装饰方法运行在 `runOutsideAngular` 内
 *
 * ```ts
 * class MockClass {
 *  constructor(public ngZone: NgZone) {}
 *
 *  {AT}ZoneOutside()
 *  runOutsideAngular(): void {}
 * }
 * ```
 */
export function ZoneOutside(options?: ZoneOptions): DecoratorType {
  return makeFn('runOutsideAngular', options);
}

/**
 * The decoration method runs in `run`
 *
 * 装饰方法运行在 `run` 内
 *
 * ```ts
 * class MockClass {
 *  constructor(public ngZone: NgZone) {}
 *
 *  {AT}ZoneRun()
 *  run(): void {}
 * }
 * ```
 */
export function ZoneRun(options?: ZoneOptions): DecoratorType {
  return makeFn('run', options);
}
