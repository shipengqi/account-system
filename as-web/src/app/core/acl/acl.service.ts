import {Inject, Injectable, InjectionToken} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {ACLCanType, ACLType} from './acl.types';
import {ACL_DEFAULT_CONFIG, ACLConfig} from './acl.config';

export const ACL_CONFIG = new InjectionToken<string>('ACL_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class ACLService {
  private options: ACLConfig = ACL_DEFAULT_CONFIG;
  private roles: string[] = [];
  private abilities: Array<number | string> = [];
  private full = false;
  private aclChange = new BehaviorSubject<ACLType | boolean | null>(null);

  /** ACL change notification */
  get change(): Observable<ACLType | boolean | null> {
    return this.aclChange.asObservable();
  }

  /** get all ACL data */
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

  get hidden_class(): string {
    return this.options.hidden_class!;
  }

  constructor(@Inject(ACL_CONFIG) aclConfig: ACLConfig) {
    this.options = Object.assign({}, this.options, aclConfig);
  }

  /**
   * set roles and abilities, clean first
   */
  set(value: ACLType): void {
    this.full = false;
    this.abilities = [];
    this.roles = [];
    this.add(value);
    this.aclChange.next(value);
  }

  /**
   * set full roles and abilities
   */
  setFull(val: boolean): void {
    this.full = val;
    this.aclChange.next(val);
  }

  /**
   * set abilities, clean first
   */
  setAbilities(abilities: Array<number | string>): void {
    this.set({ abilities: abilities } as ACLType);
  }

  /**
   * set roles, clean first
   */
  setRoles(roles: string[]): void {
    this.set({ roles: roles } as ACLType);
  }

  /**
   * add roles or abilities
   */
  add(aclValue: ACLType): void {
    if (aclValue.roles && aclValue.roles.length > 0) {
      this.roles.push(...aclValue.roles);
    }
    if (aclValue.abilities && aclValue.abilities.length > 0) {
      this.abilities.push(...aclValue.abilities);
    }
  }

  attachRoles(roles: string[]): void {
    for (const val of roles) {
      if (!this.roles.includes(val)) {
        this.roles.push(val);
      }
    }
    this.aclChange.next(this.data);
  }

  attachAbilities(abilities: Array<number | string>): void {
    for (const val of abilities) {
      if (!this.abilities.includes(val)) {
        this.abilities.push(val);
      }
    }
    this.aclChange.next(this.data);
  }

  removeRoles(roles: string[]): void {
    for (const val of roles) {
      const idx = this.roles.indexOf(val);
      if (idx !== -1) {
        this.roles.splice(idx, 1);
      }
    }
    this.aclChange.next(this.data);
  }

  removeAbilities(abilities: Array<number | string>): void {
    for (const val of abilities) {
      const idx = this.abilities.indexOf(val);
      if (idx !== -1) {
        this.abilities.splice(idx, 1);
      }
    }
    this.aclChange.next(this.data);
  }

  /**
   * Whether the current user has a corresponding role, in fact, `number` indicates Ability.
   *
   * - if `full: true` return `true`
   * - if `roleOrAbility` is `null`, indicate doesn't set acl
   * - `ACLType` can specify the `mode`
   */
  can(roleOrAbility: ACLCanType | null): boolean {
    const { preCan } = this.options;
    if (preCan) {
      roleOrAbility = preCan(roleOrAbility!);
    }

    const aclT = this.parseACLType(roleOrAbility);
    let result = false;
    if (this.full || !roleOrAbility) {
      result = true;
    } else {
      if (aclT.roles && aclT.roles.length > 0) {
        if (aclT.mode === 'allOf') {
          result = aclT.roles.every(v => this.roles.includes(v));
        } else {
          result = aclT.roles.some(v => this.roles.includes(v));
        }
      }
      if (aclT.abilities && aclT.abilities.length > 0) {
        if (aclT.mode === 'allOf') {
          result = (aclT.abilities as Array<number | string>).every(v => this.abilities.includes(v));
        } else {
          result = (aclT.abilities as Array<number | string>).some(v => this.abilities.includes(v));
        }
      }
    }

    return aclT.except === true ? !result : result;
  }

  /**
   * Whether the user has the ability
   */
  hasAbility(aclValue: ACLCanType): boolean {
    return this.can(this.parseAbilities(aclValue));
  }

  parseAbilities(aclValue: ACLCanType): ACLCanType {
    if (typeof aclValue === 'number' || typeof aclValue === 'string' || Array.isArray(aclValue)) {
      aclValue = { abilities: Array.isArray(aclValue) ? aclValue : [aclValue] } as ACLType;
    }
    delete aclValue.roles;
    return aclValue;
  }

  private parseACLType(val: string | string[] | number | number[] | ACLType | null): ACLType {
    let aclT: ACLType;
    if (typeof val === 'number') {
      aclT = { abilities: [val] };
    } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'number') {
      aclT = { abilities: val };
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      aclT = { ...val };
    } else if (Array.isArray(val)) {
      aclT = { roles: val as string[] };
    } else {
      aclT = { roles: val === null ? [] : [val] };
    }

    return { except: false, ...aclT };
  }
}
