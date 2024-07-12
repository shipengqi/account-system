import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar-btn',
  template: `
    <button nz-button nzType="text" (click)="onClick()">
      <span nz-icon [nzType]="icon"></span>
    </button>
  `,
  // host: {
  //   '[class.toolbar-nav-item]': 'true',
  // }
})
export class ToolbarButtonComponent {

  @HostBinding('class.toolbar-nav-item')
  @Input() icon!: string;
  @Output() clickEvent = new EventEmitter();

  onClick(): void {
    this.clickEvent.emit();
  }
}
