import {NavigationExtras} from '@angular/router';

// Todo may need to move model directory
export interface HeaderNavItem {
  // If specified, an HTML id will be applied to the navigation button.
  id?: string;
  name: string;
  // The route to navigate to when the tab is clicked. This accepts that same input as the routerLink directive.
  routerLink?: string | any[];
  // Additional parameters to pass to the router when using routerLink.
  // See NavigationExtras for details of the available configuration properties.
  routerExtras?: NavigationExtras;
  avatar?: string;
  selected?: boolean;
  // Todo
  disabled?: boolean;
  // A function that will be called when the navigation tab is clicked.
  // This can be used as an alternative to routerLink in cases where the router cannot be used.
  select?: (item: HeaderNavItem) => void;
  children?: HeaderNavSecondaryNavItem[];
}

// Todo support sub menu
export interface HeaderNavSecondaryNavItem {
  // If specified, an HTML id will be applied to the navigation button.
  id?: string;
  name: string;
  // The route to navigate to when the tab is clicked. This accepts that same input as the routerLink directive.
  routerLink?: string | any[];
  routerExtras?: NavigationExtras;
  selected?: boolean;
  // Todo
  disabled?: boolean;
  select?: (item: HeaderNavSecondaryNavItem) => void;
}
