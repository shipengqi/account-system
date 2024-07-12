import {TemplateRef} from '@angular/core';
import type {NzSafeAny} from 'ng-zorro-antd/core/types';

export type LayoutHeaderItemHidden = 'pc' | 'mobile' | 'none';
export type LayoutHeaderItemDirection = 'left' | 'middle' | 'right';
export type ToolbarItemDirection = LayoutHeaderItemDirection;
export type ToolbarItemHidden = LayoutHeaderItemHidden;

export interface LayoutOptions {
  /**
   * Custom Logo Area
   */
  logo?: TemplateRef<NzSafeAny> | null;
  /**
   * Logo url of expanded status, default: `./assets/logo-full.svg`
   */
  logoExpanded?: string;
  /**
   * Logo url of collapsed status, default: `./assets/logo.svg`
   */
  logoCollapsed?: string;
  /**
   * Specify an expanded logo width, default 200
   */
  logoExpandedWidth?: number;
  /**
   * Specify a collapsed logo width, default 80
   */
  logoCollapsedWidth?: number;
  /**
   * Specify the logo routing address, default: `/`
   */
  logoLink?: string;
  /**
   * Logo text
   */
  logoText?: string;
  /**
   * Specify a fixed logo width
   */
  logoFixWidth?: number;
  /**
   * Whether to show the logo or not
   */
  logoHidden?: LayoutHeaderItemHidden;
  /**
   * Hide the sidebar without showing the collapsed icon button, default: `false`
   */
  hideSider?: boolean;

  siderCollapsible?: boolean;
}
