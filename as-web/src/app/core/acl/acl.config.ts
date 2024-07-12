import {InjectionToken} from '@angular/core';
import {ACLType} from './acl.types';

export const ACL_DEFAULT_CONFIG: ACLConfig = {
  guard_url: '/403'
};

export const ACL_CONFIG_TOKEN = new InjectionToken<ACLConfig>('acl-config', {
  providedIn: 'root',
  factory: ACL_CONFIG_FACTORY
});

export function ACL_CONFIG_FACTORY(): ACLConfig {
  return {};
}

export interface ACLConfig {
  /**
   * Router URL when guard fail, default: `/403`
   */
  guard_url?: string;

  /**
   * `can` before execution callback
   */
  preCan?: ((roleOrAbility: number | number[] | string | string[] | ACLType) => ACLType | null) | null;
}
