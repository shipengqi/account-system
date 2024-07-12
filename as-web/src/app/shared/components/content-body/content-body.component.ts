import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-body',
  template: `
    <div class="content-page-body bc-white">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./content-body.component.less']
})
export class ContentBodyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
