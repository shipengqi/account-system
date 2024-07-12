# LazyService

`LazyService` 用于延迟加载 JS 或 CSS 文件，对于无须被打包 `script.js` 且又是第三方类库比较大时，非常有用。

示例：

```typescript
import { LazyService } from 'utils/lazy';

export class AppComponent {
  constructor(private _lazy: LazyService) {}

  ngOnInit() {
    this._lazy.load([`//cdn.bootcss.com/xlsx/0.11.17/xlsx.full.min.js`]).then(() => {
      // do something
    });
  }
}
```
