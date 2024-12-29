import {CommonModule} from '@angular/common';
import {
  NgModule,
  EnvironmentProviders,
  ModuleWithProviders,
  makeEnvironmentProviders
} from '@angular/core';

import {ACLDirective} from './acl.directive';
import {ACLIfDirective} from './acl-if.directive';
import {ACL_DEFAULT_CONFIG, ACLConfig} from './acl.config';
import {ACL_CONFIG, ACLService} from './acl.service';

const COMPONENTS = [ACLDirective, ACLIfDirective];

export const provideACLService = (config: ACLConfig = ACL_DEFAULT_CONFIG): EnvironmentProviders =>
{
  return makeEnvironmentProviders([
    {provide: ACL_CONFIG, useValue: config},
    ACLService
  ]);
}

@NgModule({
  imports: [CommonModule, ...COMPONENTS],
  exports: COMPONENTS
})
export class ACLModule {
  /**
   * Use this method in your root module to provide the ACLService
   */
  static forRoot(config: ACLConfig = ACL_DEFAULT_CONFIG): ModuleWithProviders<ACLModule> {
    return {
      ngModule: ACLModule,
      providers: [
        {provide: ACL_CONFIG, useValue: config},
        ACLService
      ]
    };
  }
}
