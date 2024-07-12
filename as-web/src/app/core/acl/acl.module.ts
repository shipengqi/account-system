import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {ACLDirective} from './acl.directive';
import {ACLIfDirective} from './acl-if.directive';
import {ACLService} from './acl.service';
import {ACL_CONFIG_TOKEN, ACLConfig} from './acl.config';


@NgModule({
  declarations: [
    ACLDirective,
    ACLIfDirective
  ],
  exports: [
    ACLIfDirective
  ],
  imports: [
    CommonModule
  ]
})
export class ACLModule {
  static forRoot(config: ACLConfig): ModuleWithProviders<ACLModule> {
    return {
      ngModule: ACLModule,
      providers: [
        {provide: ACL_CONFIG_TOKEN, useValue: config},
        ACLService
      ]
    };
  }
}
