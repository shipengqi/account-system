import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {NzTabChangeEvent} from 'ng-zorro-antd/tabs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  // Todo validations and custom icon and title
  form = this._fb.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(/^(admin|user)$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(123456)$/)]],
    mobile: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
    captcha: ['', [Validators.required]],
    stay: [true]
  });

  error = '';
  loading = false;
  count = 0;
  interval$: any;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {}

  getCaptcha(): void {
    const mobile = this.form.controls.mobile;
    if (mobile.invalid) {
      mobile.markAsDirty({onlySelf: true});
      mobile.updateValueAndValidity({onlySelf: true});
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }


  submit(): void {}

  switch({index}: NzTabChangeEvent): void {}
}
