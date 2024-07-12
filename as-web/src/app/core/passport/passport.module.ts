import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink, RouterOutlet} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzProgressModule} from 'ng-zorro-antd/progress';
import {NzResultModule} from 'ng-zorro-antd/result';

import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {LoginComponent} from './login/login.component';
import {PassportComponent} from './passport.component';
import {PassportRoutingModule} from './passport-routing.module';
import {RegisterComponent} from './register/register.component';
import {ResultComponent} from './result/result.component';

@NgModule({
  declarations: [
    ForgetPasswordComponent,
    RegisterComponent,
    LoginComponent,
    PassportComponent,
    ResultComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    TranslateModule,
    NzFormModule,
    NzTabsModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzAlertModule,
    NzSelectModule,
    NzPopoverModule,
    NzProgressModule,
    NzResultModule,
    PassportRoutingModule
  ]
})
export class PassportModule {}
