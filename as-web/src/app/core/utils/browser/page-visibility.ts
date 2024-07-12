import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { fromEvent, Observable, distinctUntilChanged, map, share, startWith } from 'rxjs';

/**
 * Use the `visibilitychange` event to monitor whether the browser tab is visible, which is generally used when the user leaves the browser tab to temp interrupt the backend to continue sending requests
 *
 * 通过 `visibilitychange` 事件来监听浏览器选项卡是否可见，一般用于当用户离开应用时暂时中断后端持续发送请求，或者关闭音频视频等场景
 * Page Visibility API, 浏览器标签页被隐藏或显示的时候会触发 visibilitychange 事件
 */
export const PAGE_VISIBILITY = new InjectionToken<Observable<boolean>>('PAGE_VISIBILITY`', {
  factory: () => {
    const doc = inject(DOCUMENT);
    return fromEvent(doc, 'visibilitychange').pipe(
      startWith(0),
      map(() => !doc.hidden),
      distinctUntilChanged(),
      share()
    );
  }
});
