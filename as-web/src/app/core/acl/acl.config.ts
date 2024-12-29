import {ACLType} from './acl.types';

export interface ACLConfig {
  /**
   * Router URL when guard fail, default: `/403`
   */
  guard_url?: string;
  /**
   * Used to hide the element, default: `acl__hide`
   */
  hidden_class?: string;

  /**
   * `can` before execution callback
   */
  preCan?: ((roleOrAbility: number | number[] | string | string[] | ACLType) => ACLType | null) | null;
}

export const ACL_DEFAULT_CONFIG: ACLConfig = {
  guard_url: '/403',
  hidden_class: 'acl__hide'
};
