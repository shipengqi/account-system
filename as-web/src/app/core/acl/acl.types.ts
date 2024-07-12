import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

import type { ACLService } from './acl.service';

export interface ACLType {
  /**
   * 角色
   */
  roles?: string[];
  /**
   * 权限点
   */
  abilities?: number[] | string[];

  /**
   * Validated against, default: `oneOf`
   * - `allOf` the value validates against all the roles or abilities
   * - `oneOf` the value validates against exactly one of the roles or abilities
   */
  mode?: 'allOf' | 'oneOf';

  /**
   * 是否取反，即结果为 `true` 时表示未授权
   */
  except?: boolean;

  [key: string]: any;
}

export type ACLCanType = number | number[] | string | string[] | ACLType;

export type ACLGuardFunctionType = (srv: ACLService, injector: Injector) => Observable<ACLCanType>;
export type ACLGuardType = ACLCanType | Observable<ACLCanType> | ACLGuardFunctionType;
