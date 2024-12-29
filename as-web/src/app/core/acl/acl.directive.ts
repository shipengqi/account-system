import {Directive, ElementRef, inject, Input, OnDestroy, Renderer2} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {filter, Subscription} from 'rxjs';

import {ACLService} from './acl.service';
import {ACLCanType} from './acl.types';

@Directive({
  selector: '[acl]',
  exportAs: 'acl',
  standalone: true
})
export class ACLDirective implements OnDestroy {
  private readonly _el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly _renderer = inject(Renderer2);
  private readonly _acl = inject(ACLService);

  private _value!: ACLCanType;
  private _change$: Subscription;

  @Input('acl')
  set acl(value: ACLCanType) {
    this.set(value);
  }

  @Input('acl-ability')
  set ability(value: ACLCanType) {
    this.set(this._acl.parseAbilities(value));
  }

  private set(value: ACLCanType): void {
    this._value = value;
    const CLS = this._acl.hidden_class;
    const el = this._el;
    const pass = this._acl.can(this._value);
    if (typeof value === 'object' && !Array.isArray(value) && value.action && value.action === 'disable') {
      if (pass) {
        this._renderer.setProperty(el, 'disabled', false);
      } else {
        // Promise or Timeout is required for some rendering.
        Promise.resolve().then(() => this._renderer.setProperty(el, 'disabled', true));
      }
    } else {
      if (pass) {
        this._renderer.removeClass(el, CLS);
      } else {
        this._renderer.addClass(el, CLS);
      }
    }
  }

  constructor() {
    this._change$ = this._acl.change.pipe(
      takeUntilDestroyed(),
      filter(r => r != null)
    ).subscribe(() => this.set(this._value));
  }

  ngOnDestroy(): void {
    this._change$.unsubscribe();
  }
}
