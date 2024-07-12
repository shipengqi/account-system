import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {ToolbarItemDirection, ToolbarItemHidden} from '../../../types';

@Component({
  selector: 'app-toolbar-item',
  template: `
    <ng-template #host>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class ToolbarItemComponent {
  @ViewChild('host', {static: true}) host!: TemplateRef<void>;

  @Input() hidden: ToolbarItemHidden = 'none';
  @Input() direction: ToolbarItemDirection = 'right';
}
