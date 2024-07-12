import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {NzSafeAny} from 'ng-zorro-antd/core/types';

import {MatchControl} from '../../utils/form';

@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.less']
})
export class ForgetPasswordComponent implements OnInit {

  form = this._fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6), ForgetPasswordComponent.checkPassword.bind(this)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]],
      mobilePrefix: ['+86'],
      mobile: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: ['', [Validators.required]]
    },
    {
      validators: MatchControl('password', 'confirm')
    }
  );
  error = '';
  loading = false;
  count = 0;
  interval$: NzSafeAny;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap: { [key: string]: 'success' | 'normal' | 'exception' } = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception'
  };

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {}

  static checkPassword(control: FormControl): NzSafeAny {
    if (!control) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: NzSafeAny = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  getCaptcha(): void {
    const mobile = this.form.controls.mobile;
    if (mobile.invalid) {
      mobile.markAsDirty({ onlySelf: true });
      mobile.updateValueAndValidity({ onlySelf: true });
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

}
