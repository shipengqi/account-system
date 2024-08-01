import {Component, OnInit} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  UntypedFormControl
} from "@angular/forms";

import moment from "moment/moment";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {TranslateService} from "@ngx-translate/core";
import {NzTableQueryParams} from "ng-zorro-antd/table";

import {IDriver} from "../../shared/model/model";
import {DriversService} from "../../shared/services/drivers.service";

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.less'
})
export class DriversComponent implements OnInit {
  tableLoading = true;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  items: IDriver[] = [];

  editorVisible = false;
  editorSaving = false;
  isEditMode = false;
  editId = 0;

  selfFormGroup = new FormGroup({});
  nameCtrl: AbstractControl = new UntypedFormControl();
  phoneCtrl: AbstractControl = new UntypedFormControl();
  addressCtrl: AbstractControl = new UntypedFormControl();
  commentCtrl: AbstractControl = new UntypedFormControl();

  constructor(
    private _modal: NzModalService,
    private _message: NzMessageService,
    private _translate: TranslateService,
    private _driversSvc: DriversService
  ) {}

  ngOnInit() {
    this.selfFormGroup.addControl(
      'name',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'phone',
      new FormControl('', [Validators.required, Validators.maxLength(11)])
    );
    this.selfFormGroup.addControl(
      'address',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'comment',
      new FormControl('', [Validators.maxLength(256)])
    );

    this.nameCtrl = this.selfFormGroup.get('name') as AbstractControl;
    this.phoneCtrl = this.selfFormGroup.get('phone') as AbstractControl;
    this.addressCtrl = this.selfFormGroup.get('address') as AbstractControl;
    this.commentCtrl = this.selfFormGroup.get('comment') as AbstractControl;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.list();
  }

  openEditor(item?: IDriver) {
    this.editorVisible = true;
    this.isEditMode = false;
    this.editId = 0;
    if (item) {
      this.nameCtrl.setValue(item.name);
      this.phoneCtrl.setValue(item.phone);
      this.addressCtrl.setValue(item.address);
      this.commentCtrl.setValue(item.comment);
      this.isEditMode = true;
      this.editId = item.id;
    }
  }

  list() {
    this.tableLoading = true;
    this._driversSvc.list(this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.items = res.items;
        this.total = res.total;
        this.tableLoading = false;
      },
      error: (err) => {
        this.tableLoading = false;
      }
    })
  }

  handleCancel() {
    this.editorVisible = false;
  }

  handleSave() {
    const data = {
      name: this.nameCtrl.value,
      phone: this.phoneCtrl.value,
      address: this.addressCtrl.value,
      comment: this.commentCtrl.value,
      id: 0
    };
    let submit = this._driversSvc.create;
    if (this.isEditMode) {
      submit = this._driversSvc.update;
      data.id = this.editId;
    }
    submit.bind(this._driversSvc)(data).subscribe({
      next: (res) => {
        this._message.success(this._translate.instant('global.save-success'));
        this.editorSaving = false;
        this.editorVisible = false;
        this.selfFormGroup.reset();
        this.list();
      },
      error: (err) => {
        this.editorVisible = false;
      }
    });
  }

  openDeleteConfirm(id: number): void {
    this._modal.confirm({
      nzTitle: this._translate.instant('driver.delete-title'),
      nzContent: this._translate.instant('driver.delete-confirm'),
      nzOkText: this._translate.instant('global.yes'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this._driversSvc.delete(id).subscribe({
          next: () => {
            this._message.success(this._translate.instant('global.delete-success'));
            this.list();
          }
        });
      },
      nzCancelText: this._translate.instant('global.cancel'),
      nzOnCancel: () => console.log('driver delete cancel')
    });
  }

  formatDatetime(time: string): string {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }

  formatStatus(t: number): string {
    // Todo complete status
    return this._translate.instant('global.available');
  }
}
