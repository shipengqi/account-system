import {
  Input,
  Output,
  Component,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-header-help',
  template: `
    <div class="layout-nav-item d-flex layout-header-items-center px-sm mr-sm header-help"
         nz-dropdown
         nzPlacement="bottomRight"
         nzTrigger="click"
         [nzDropdownMenu]="helpMenu"
         (click)="onClick()">
      <span class="layout-nav-item-icon" nz-icon nzType="question-circle" nzTheme="outline"></span>
    </div>
    <nz-dropdown-menu #helpMenu="nzDropdownMenu">
      <div nz-menu class="header-help-menu">
        <div *ngIf="loading" class="header-help-loader"><nz-spin nzSimple></nz-spin></div>
        <div *ngIf="!loading" class="mx-sm">
          <div nz-menu-item>{{ 'core.help.build-version' | translate}}: {{version}}</div>
          <div nz-menu-item>{{ 'core.help.build-date' | translate}}: {{date}}</div>
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderHelpComponent {
  @Input() loading = true;
  @Input() version = '';
  @Input() date = '';
  @Output() clickEvent = new EventEmitter();

  constructor() {}

  onClick() {
    this.clickEvent.emit();
  }
}
