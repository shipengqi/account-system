import { Renderer2 } from '@angular/core';

/**
 * Update host component style `class`
 *
 * ```ts
 * updateHostClass(
 *  this.el.nativeElement,
 *  this.renderer,
 *  {
 *    [ 'classname' ]: true,
 *    [ 'classname' ]: this.type === '1',
 *    [ this.cls ]: true,
 *    [ `a-${this.cls}` ]: true
 *  })
 * ```
 */
export function updateHostClass(
  el: HTMLElement,
  renderer: Renderer2,
  classMap: { [klass: string]: unknown },
  preClean = false
): void {
  if (preClean) {
    renderer.removeAttribute(el, 'class');
  } else {
    removeClass(el, classMap, renderer);
  }
  classMap = { ...classMap };
  addClass(el, classMap, renderer);
}

function removeClass(el: HTMLElement, classMap: { [klass: string]: unknown }, renderer: Renderer2): void {
  Object.keys(classMap).forEach(key => renderer.removeClass(el, key));
}

function addClass(el: HTMLElement, classMap: { [klass: string]: unknown }, renderer: Renderer2): void {
  for (const i in classMap) {
    if (classMap[i]) {
      renderer.addClass(el, i);
    }
  }
}

export function preloaderFinished(): void {
  const body = document.querySelector('body')!;
  const preloader = document.querySelector('.preloader')!;

  body.style.overflow = 'hidden';

  function remove(): void {
    // preloader value null when running --hmr
    if (!preloader) return;
    preloader.addEventListener('transitionend', () => {
      preloader.className = 'preloader-hidden';
    });

    preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
  }

  (window as any).appBootstrap = () => {
    setTimeout(() => {
      remove();
      body.style.overflow = '';
    }, 100);
  };
}
