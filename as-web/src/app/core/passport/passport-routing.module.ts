import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {PassportComponent} from "./passport.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {ResultComponent} from "./result/result.component";

const routes: Routes = [
  {
    path: '',
    component: PassportComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'forgetpass', component: ForgetPasswordComponent},
    ]
  },
  // Moved from the Routes.children of the PassportComponent, in order to be displayed as a separate page.
  {path: 'logout', component: ResultComponent, data: {title: 'passport.logout.success'}},
  {path: 'reset', component: ResultComponent, data: {title: 'passport.forget-pass.reset-success'}},
  {path: 'registered', component: ResultComponent, data: {title: 'passport.register.success'}},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PassportRoutingModule {}
