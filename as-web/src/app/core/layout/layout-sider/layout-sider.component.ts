import {Component, Input} from '@angular/core';
import {LayoutService} from '../layout.service';

export interface SideMenuItem {
  level: number;
  title: string;
  icon?: string;
  open?: boolean;
  selected?: boolean;
  disabled?: boolean;
  // The route to navigate to when the tab is clicked. This accepts that same input as the routerLink directive.
  routerLink?: string | any[];
  // only match when the url matches the link exactly, same as routerLinkActiveOptions
  routerExact?: boolean;
  // A function that will be called when the navigation tab is clicked.
  // This can be used as an alternative to routerLink in cases where the router cannot be used.
  select?: (item: SideMenuItem) => void;
  children?: SideMenuItem[];
}

@Component({
  selector: 'app-layout-sider',
  templateUrl: './layout-sider.component.html',
})
export class LayoutSiderComponent {

  _collapsed = false;

  // initial collapse status
  @Input() collapsed = false;
  @Input() collapsible: boolean | undefined = false;
  @Input() menus: SideMenuItem[] = [];
  constructor(private _svc: LayoutService) {}

  setCollapsed(collapsed: boolean): void {
    if (!this.collapsible) {
      this._collapsed = false;
      return;
    }
    this._collapsed = collapsed;
    this._svc.toggleCollapsed(this._collapsed);
  }

  selectSideMenu(item: SideMenuItem): void {
    if (item.select) {
      item.select.call(item, item);
    }
  }

  siderWidth(): number {
    if (this._collapsed) {
      return <number>this._svc.options.logoCollapsedWidth;
    }
    return <number>this._svc.options.logoExpandedWidth;
  }
}
