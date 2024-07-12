import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {LayoutHeaderItemHidden, LayoutHeaderItemDirection} from '../../types';

@Component({
  selector: 'app-layout-header-item',
  template: `
    <ng-template #host>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class LayoutHeaderItemComponent {
  @ViewChild('host', {static: true}) host!: TemplateRef<void>;

  @Input() hidden: LayoutHeaderItemHidden = 'none';
  @Input() direction: LayoutHeaderItemDirection = 'right';
}
