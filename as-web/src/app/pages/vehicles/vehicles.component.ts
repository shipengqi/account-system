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
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {TranslateService} from "@ngx-translate/core";

import {IVehicle} from "../../shared/model/model";
import {VehiclesService} from "../../shared/services/vehicles.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.less'
})
export class VehiclesComponent implements OnInit {
  tableLoading = true;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  items: IVehicle[] = [];

  editorVisible = false;
  editorSaving = false;
  isEditMode = false;
  editId = 0;

  selfFormGroup = new FormGroup({});
  vehicleNumberCtrl: AbstractControl = new UntypedFormControl();
  brandCtrl: AbstractControl = new UntypedFormControl();
  commentCtrl: AbstractControl = new UntypedFormControl();

  constructor(
    private _modal: NzModalService,
    private _message: NzMessageService,
    private _translate: TranslateService,
    private _vehicleSvc: VehiclesService
  ) {}

  ngOnInit() {
    this.selfFormGroup.addControl(
      'vehicle-number',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'brand',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'comment',
      new FormControl('', [Validators.maxLength(256)])
    );

    this.vehicleNumberCtrl = this.selfFormGroup.get('vehicle-number') as AbstractControl;
    this.brandCtrl = this.selfFormGroup.get('brand') as AbstractControl;
    this.commentCtrl = this.selfFormGroup.get('comment') as AbstractControl;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.list();
  }

  openEditor(item?: IVehicle) {
    this.editorVisible = true;
    this.isEditMode = false;
    this.editId = 0;
    if (item) {
      this.vehicleNumberCtrl.setValue(item.number);
      this.brandCtrl.setValue(item.brand);
      this.commentCtrl.setValue(item.comment);
      this.isEditMode = true;
      this.editId = item.id;
    }
  }

  list() {
    this.tableLoading = true;
    this._vehicleSvc.list(this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.items = res.items;
        this.total = res.total;
        this.tableLoading = false;
      },
      error: (err) => {
        this._message.error(err.message);
        this.tableLoading = false;
      }
    })
  }

  handleCancel() {
    this.editorVisible = false;
  }

  handleSave() {
    const data = {
      brand: this.brandCtrl.value,
      number: this.vehicleNumberCtrl.value,
      comment: this.commentCtrl.value,
      id: 0
    };
    let submit = this._vehicleSvc.create;
    if (this.isEditMode) {
      submit = this._vehicleSvc.update;
      data.id = this.editId;
    }
    submit.bind(this._vehicleSvc)(data).subscribe({
      next: (res) => {
        this._message.success(this._translate.instant('global.save-success'));
        this.editorSaving = false;
        this.editorVisible = false;
        this.selfFormGroup.reset();
        this.list();
      },
      error: (err) => {
        this.editorVisible = false;
        this._message.error(err.message);
      }
    });
  }

  openDeleteConfirm(id: number): void {
    this._modal.confirm({
      nzTitle: this._translate.instant('vehicle.delete-title'),
      nzContent: this._translate.instant('vehicle.delete-confirm'),
      nzOkText: this._translate.instant('global.yes'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this._vehicleSvc.delete(id).subscribe({
          next: () => {
            this._message.success(this._translate.instant('global.delete-success'));
            this.list();
          },
          error: (err) => {
            this._message.error(err.message);
          }
        });
      },
      nzCancelText: this._translate.instant('global.cancel'),
      nzOnCancel: () => console.log('vehicle delete cancel')
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
