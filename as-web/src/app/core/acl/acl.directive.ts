import {Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {ACLService} from './acl.service';
import {ACLCanType} from './acl.types';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[acl]',
  exportAs: 'acl'
})
export class ACLDirective implements OnDestroy {
  private _value!: ACLCanType;
  private change$: Subscription;

  @Input()
  set acl(value: ACLCanType) {
    this.set(value);
  }

  @Input()
  set ability(value: ACLCanType) {
    this.set(this._svc.parseAbility(value));
  }

  private set(value: ACLCanType): void {
    this._value = value;
    const CLS = 'acl__hide';
    const el = this._el.nativeElement;
    if (this._svc.can(this._value)) {
      this._renderer.removeClass(el, CLS);
    } else {
      this._renderer.addClass(el, CLS);
    }
  }

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    protected _svc: ACLService
  ) {
    this.change$ = this._svc.change.pipe(filter(r => r != null)).subscribe(() => this.set(this._value));
  }

  ngOnDestroy(): void {
    this.change$.unsubscribe();
  }
}
