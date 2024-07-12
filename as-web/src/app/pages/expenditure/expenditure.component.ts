import {Component, OnInit, TemplateRef} from '@angular/core';

import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from "ng-zorro-antd/message";
import {TranslateService} from "@ngx-translate/core";
import moment from 'moment';

import {IExpenditure} from "../../shared/model/model";
import {ExpenditureService} from "../../shared/services/expenditure.service";
import {AbstractControl, FormControl, FormGroup, UntypedFormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrl: './expenditure.component.less'
})
export class ExpenditureComponent implements OnInit {
  selfFormGroup = new FormGroup({});
  typeCtrl: AbstractControl = new UntypedFormControl();
  timeCtrl: AbstractControl = new UntypedFormControl();
  costCtrl: AbstractControl = new UntypedFormControl();
  commentCtrl: AbstractControl = new UntypedFormControl();
  editorVisible = false;
  editorSaving = false;
  isEditMode = false;

  constructor(
    private _modal: NzModalService,
    private _translate: TranslateService,
    private _expenditureSvc: ExpenditureService,
    private _message: NzMessageService
  ) {}

  ngOnInit() {
    this.selfFormGroup.addControl(
      'type',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'time',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'cost',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'comment',
      new FormControl('', [Validators.maxLength(256)])
    );

    this.typeCtrl = this.selfFormGroup.get('type') as AbstractControl;
    this.timeCtrl = this.selfFormGroup.get('time') as AbstractControl;
    this.costCtrl = this.selfFormGroup.get('cost') as AbstractControl;
    this.commentCtrl = this.selfFormGroup.get('comment') as AbstractControl;

    this.list();
  }

  types = [
    {text: this._translate.instant('expenditure.toll'), value: 1},
    {text: this._translate.instant('expenditure.fuel'), value: 2},
    {text: this._translate.instant('expenditure.maintenance'), value: 3},
    {text: this._translate.instant('expenditure.weighbridge-fee'), value: 4},
    {text: this._translate.instant('expenditure.water-refilling-fee'), value: 5},
    {text: this._translate.instant('expenditure.other-fees'), value: 6},
  ];
  tableLoading = true;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  items: IExpenditure[] = [];

  list() {
    this.tableLoading = true;
    this._expenditureSvc.list(this.pageIndex, this.pageSize).subscribe({
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

  openEditor(item?: IExpenditure): void {
    this.editorVisible = true;
    this.isEditMode = false;
    if (item) {
      this.typeCtrl.setValue(item.type);
      this.timeCtrl.setValue(item.expend_at);
      this.costCtrl.setValue(item.cost);
      this.commentCtrl.setValue(item.comment);
      this.isEditMode = true;
    }
  }

  handleCancel() {
    this.editorVisible = false;
  }

  handleSave() {
    const data = {
      type: this.typeCtrl.value,
      expend_at: moment(this.timeCtrl.value).format('YYYY-MM-DD'),
      cost: this.costCtrl.value,
      comment: this.commentCtrl.value
    };
    let submit = this._expenditureSvc.create;
    if (this.isEditMode) {
      submit = this._expenditureSvc.update;
    }
    submit.bind(this._expenditureSvc)(data).subscribe({
      next: (res) => {
        this._message.success(this._translate.instant('global.save-success'));
        this.editorSaving = false;
        this.editorVisible = false;
        this.selfFormGroup.reset();
      },
      error: (err) => {
        this.editorVisible = false;
        this._message.error(err.message);
      }
    });
  }

  openDeleteConfirm(id: number): void {
    this._modal.confirm({
      nzTitle: this._translate.instant('expenditure.delete-title'),
      nzContent: this._translate.instant('expenditure.delete-confirm'),
      nzOkText: this._translate.instant('global.yes'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this._expenditureSvc.delete(id).subscribe({
          next: () => {
            this._message.success(this._translate.instant('global.delete-success'));
          },
          error: (err) => {
            this._message.error(err.message);
          }
        });
      },
      nzCancelText: this._translate.instant('global.cancel'),
      nzOnCancel: () => console.log('expenditure delete cancel')
    });
  }

  formatDatetime(time: string): string {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }

  formatType(t: number): string {
    const found = this.types.find((ty) => ty.value === t);
    return found ? found.text : this._translate.instant('global.unknown');
  }
}
