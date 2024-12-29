export interface ACLType {
  roles?: string[];
  abilities?: Array<string | number>;

  /**
   * Validated against, default: `oneOf`
   * - `allOf` the value validates against all the roles or abilities
   * - `oneOf` the value validates against exactly one of the roles or abilities
   */
  mode?: 'allOf' | 'oneOf';

  /**
   * Hide element or disable element, default: `hide`
   */
  action?: 'hide' | 'disable';

  /**
   * Inverted or not, i.e., a result of `true` indicates no authorization.
   */
  except?: boolean;

  [key: string]: any;
}

export type ACLCanType = number | number[] | string | string[] | ACLType;
