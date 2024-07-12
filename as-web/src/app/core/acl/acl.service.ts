import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {ACLCanType, ACLType} from './acl.types';
import {ACL_CONFIG_TOKEN, ACL_DEFAULT_CONFIG, ACLConfig} from './acl.config';

/**
 * ACL 控制服务
 *
 * 务必在根目录注册 `ACLModule.forRoot()` 才能使用服务
 */
@Injectable()
export class ACLService {
  private options: ACLConfig;
  private roles: string[] = [];
  private abilities: Array<number | string> = [];
  private full = false;
  private aclChange = new BehaviorSubject<ACLType | boolean | null>(null);

  /** ACL 变更通知 */
  get change(): Observable<ACLType | boolean | null> {
    return this.aclChange.asObservable();
  }

  /** 获取所有数据 */
  get data(): { full: boolean; roles: string[]; abilities: Array<string | number> } {
    return {
      full: this.full,
      roles: this.roles,
      abilities: this.abilities
    };
  }

  get guard_url(): string {
    return this.options.guard_url!;
  }

  constructor(@Inject(ACL_CONFIG_TOKEN) cfg: ACLConfig) {
    this.options = Object.assign({}, cfg, ACL_DEFAULT_CONFIG);
  }

  private parseACLType(val: string | string[] | number | number[] | ACLType | null): ACLType {
    let t: ACLType;
    if (typeof val === 'number') {
      t = { abilities: [val] };
    } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'number') {
      t = { abilities: val };
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      t = { ...val };
    } else if (Array.isArray(val)) {
      t = { roles: val as string[] };
    } else {
      t = { roles: val == null ? [] : [val] };
    }
    return { except: false, ...t };
  }

  /**
   * 设置当前用户角色或权限能力（会先清除所有）
   */
  set(value: ACLType): void {
    this.full = false;
    this.abilities = [];
    this.roles = [];
    this.add(value);
    this.aclChange.next(value);
  }

  /**
   * 标识当前用户为全量，即不受限
   */
  setFull(val: boolean): void {
    this.full = val;
    this.aclChange.next(val);
  }

  /**
   * 设置当前用户权限能力（会先清除所有）
   */
  setAbility(abilities: Array<number | string>): void {
    this.set({ abilities: abilities } as ACLType);
  }

  /**
   * 设置当前用户角色（会先清除所有）
   */
  setRole(roles: string[]): void {
    this.set({ roles: roles } as ACLType);
  }

  /**
   * 为当前用户增加角色或权限能力
   */
  add(value: ACLType): void {
    if (value.roles && value.roles.length > 0) {
      this.roles.push(...value.roles);
    }
    if (value.abilities && value.abilities.length > 0) {
      this.abilities.push(...value.abilities);
    }
  }

  /**
   * 为当前用户附加角色
   */
  attachRole(roles: string[]): void {
    for (const val of roles) {
      if (!this.roles.includes(val)) {
        this.roles.push(val);
      }
    }
    this.aclChange.next(this.data as ACLType);
  }

  /**
   * 为当前用户附加权限
   */
  attachAbility(abilities: Array<number | string>): void {
    for (const val of abilities) {
      if (!this.abilities.includes(val)) {
        this.abilities.push(val);
      }
    }
    this.aclChange.next(this.data as ACLType);
  }

  /**
   * 为当前用户移除角色
   */
  removeRole(roles: string[]): void {
    for (const val of roles) {
      const idx = this.roles.indexOf(val);
      if (idx !== -1) {
        this.roles.splice(idx, 1);
      }
    }
    this.aclChange.next(this.data as ACLType);
  }

  /**
   * 为当前用户移除权限
   */
  removeAbility(abilities: Array<number | string>): void {
    for (const val of abilities) {
      const idx = this.abilities.indexOf(val);
      if (idx !== -1) {
        this.abilities.splice(idx, 1);
      }
    }
    this.aclChange.next(this.data as ACLType);
  }

  /**
   * 当前用户是否有对应角色，`number` 表示 Ability
   *
   * - 当 `full: true` 或参数 `null` 时返回 `true`
   * - 若使用 `ACLType` 参数，可以指定 `mode` 校验模式
   */
  can(roleOrAbility: ACLCanType | null): boolean {
    const t = this.parseACLType(roleOrAbility);
    let result = false;
    if (this.full || !roleOrAbility) {
      result = true;
    } else {
      if (t.roles && t.roles.length > 0) {
        if (t.mode === 'allOf') {
          result = t.roles.every(v => this.roles.includes(v));
        } else {
          result = t.roles.some(v => this.roles.includes(v));
        }
      }

      if (t.abilities && t.abilities.length > 0) {
        if (t.mode === 'allOf') {
          result = (t.abilities as Array<number | string>).every(v => this.abilities.includes(v));
        } else {
          result = (t.abilities as Array<number | string>).some(v => this.abilities.includes(v));
        }
      }
    }

    return t.except === true ? !result : result;
  }

  /** @inner */
  parseAbility(value: ACLCanType): ACLCanType {
    if (typeof value === 'number' || typeof value === 'string' || Array.isArray(value)) {
      value = { abilities: Array.isArray(value) ? value : [value] } as ACLType;
    }
    delete value.roles;
    return value;
  }

  /**
   * 当前用户是否有对应权限点
   */
  canAbility(value: ACLCanType): boolean {
    return this.can(this.parseAbility(value));
  }
}
