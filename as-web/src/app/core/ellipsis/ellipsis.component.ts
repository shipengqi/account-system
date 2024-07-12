import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  Input,
  ElementRef,
  ChangeDetectorRef,
  Inject,
  AfterViewInit,
  OnChanges,
  NgZone,
  ViewChild
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {take} from 'rxjs';
import {NzSafeAny} from 'ng-zorro-antd/core/types';

@Component({
  selector: 'ellipsis',
  exportAs: 'ellipsis',
  templateUrl: './ellipsis.component.html',
  styleUrls: ['./ellipsis.component.less'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EllipsisComponent implements AfterViewInit, OnChanges {
  @ViewChild('orgEl', {static: false}) private _orgEl!: ElementRef;
  @ViewChild('shadowOrgEl', {static: false}) private _shadowOrgEl!: ElementRef;
  @ViewChild('shadowTextEl', {static: false}) private _shadowTextEl!: ElementRef;
  private initialized = false;
  text = '';
  orgHtml!: SafeHtml;
  targetCount = 0;
  truncated = false;

  @Input() tooltip = true;
  @Input() length?: number;
  @Input() lines = 1;
  @Input() tail = '...';

  constructor(
    @Inject(DOCUMENT) private doc: NzSafeAny,
    private _el: ElementRef,
    private _zone: NgZone,
    private _dom: DomSanitizer,
    private _cdr: ChangeDetectorRef
  ) {}

  private get win(): NzSafeAny {
    return this.doc.defaultView || window;
  }

  get lineText(): string {
    const {targetCount, text, tail} = this;
    return (
      (targetCount > 0 ? text.substring(0, targetCount) : '') +
      (targetCount > 0 && targetCount < text.length ? tail : '')
    );
  }

  private truncate(
    targetHeight: number,
    mid: number,
    text: string,
    node: HTMLElement
  ): number {
    node.innerHTML = text.substring(0, mid) + this.tail;
    const oh = node.offsetHeight;
    if (oh > targetHeight) {
      // Math.floor(mid / 2) bisect the string will remove too many characters
      mid = Math.floor(mid * 0.8)
      mid = mid - 1 > 0 ? mid - 1 : mid + 1;
      return this.truncate(targetHeight, mid, text, node);
    }
    return mid - 1 <= 0 ? mid : mid - 1;
  }

  private getEl(cls: string): HTMLElement {
    return this._el.nativeElement.querySelector(cls);
  }

  private executeOnStable(fn: () => void): void {
    if (this._zone.isStable) {
      fn();
    } else {
      this._zone.onStable.asObservable().pipe(take(1)).subscribe(fn);
    }
  }

  private gen(): void {
    const {_shadowOrgEl, _shadowTextEl, _cdr, _zone, lines} = this;
    const orgNode = _shadowOrgEl.nativeElement as HTMLElement;
    const lineText = orgNode.innerText || orgNode.textContent!;
    const lineHeight = parseInt(this.win.getComputedStyle(this.getEl('.ellipsis')).lineHeight!, 10);
    const targetHeight = lines! * lineHeight;
    if (orgNode.offsetHeight <= targetHeight) {
      this.text = lineText;
      this.targetCount = lineText.length;
    } else {
      const len = lineText.length;
      const mid = Math.ceil(len / 2);

      const count = this.truncate(targetHeight, mid, lineText, _shadowTextEl.nativeElement.firstChild);
      this.text = lineText;
      this.targetCount = count;
      this.truncated = true;
    }
    _zone.run(() => _cdr.detectChanges());
  }

  refresh(): void {
    const {_dom, _orgEl, _cdr} = this;
    const html = _orgEl.nativeElement.innerHTML;
    this.orgHtml = _dom.bypassSecurityTrustHtml(html);
    _cdr.detectChanges();

    this.executeOnStable(() => {
      this.gen();
    });
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    this.refresh();
  }

  ngOnChanges(): void {
    if (this.initialized) {
      this.refresh();
    }
  }
}
