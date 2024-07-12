import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-content-toolbar',
  template: `
    <nz-card [nzBordered]="bordered" class="content-page-toolbar">
      <ng-content></ng-content>
    </nz-card>
  `,
  styleUrls: ['./content-toolbar.component.less']
})
export class ContentToolbarComponent implements OnInit {

  constructor() { }

  @Input() bordered = false;

  ngOnInit(): void {
  }

}
