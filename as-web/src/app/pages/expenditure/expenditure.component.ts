import {Component, OnInit} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  UntypedFormControl
} from "@angular/forms";

import moment from 'moment';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {TranslateService} from "@ngx-translate/core";

import {ExpenditureSearchData, IExpenditure, IVehicle} from "../../shared/model/model";
import {ExpenditureService} from "../../shared/services/expenditure.service";
import {VehiclesService} from "../../shared/services/vehicles.service";

@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrl: './expenditure.component.less'
})
export class ExpenditureComponent implements OnInit {
  searchType: number = -1;
  searchTime: string[] = [];
  searchVehicleID: number = -1;

  selfFormGroup = new FormGroup({});
  typeCtrl: AbstractControl = new UntypedFormControl();
  timeCtrl: AbstractControl = new UntypedFormControl();
  costCtrl: AbstractControl = new UntypedFormControl();
  vehicleCtrl: AbstractControl = new UntypedFormControl();
  commentCtrl: AbstractControl = new UntypedFormControl();

  editorTitle = '';
  editorVisible = false;
  editorSaving = false;
  isEditMode = false;
  isVehicleLoading = false;
  editId = 0;
  vehicleList: IVehicle[] = [];

  constructor(
    private _modal: NzModalService,
    private _translate: TranslateService,
    private _expenditureSvc: ExpenditureService,
    private _vehicleSvc: VehiclesService,
    private _message: NzMessageService
  ) {}

  ngOnInit() {
    this.selfFormGroup.addControl(
      'type',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'time',
      new FormControl(moment().format('YYYY-MM-DD'), [Validators.required])
    );
    this.selfFormGroup.addControl(
      'cost',
      new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ])
    );
    this.selfFormGroup.addControl(
      'vehicle-number',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'comment',
      new FormControl('', [Validators.maxLength(256)])
    );

    this.typeCtrl = this.selfFormGroup.get('type') as AbstractControl;
    this.timeCtrl = this.selfFormGroup.get('time') as AbstractControl;
    this.costCtrl = this.selfFormGroup.get('cost') as AbstractControl;
    this.vehicleCtrl = this.selfFormGroup.get('vehicle-number') as AbstractControl;
    this.commentCtrl = this.selfFormGroup.get('comment') as AbstractControl;

    this.list();
    this.loadVehicles();
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
  expendAtSortOrder: string|null = null;
  expendAtSortDirections = ['ascend', 'descend', null];
  total = 0;
  items: IExpenditure[] = [];

  search(): void {
    this.list();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    this.list();
  }

  loadVehicles(): void {
    this.isVehicleLoading = true;
    this._vehicleSvc.listAll().subscribe({
      next: (res) => {
        this.isVehicleLoading = false;
        this.vehicleList = res.items;
      },
      error: (err) => {
        this.isVehicleLoading = false;
        this.vehicleList = [];
      }
    });
  }

  list() {
    this.tableLoading = true;

    const searchData: ExpenditureSearchData = {
      type: this.searchType || -1,
      expend_range: this.searchTime || [],
      vehicle_id: this.searchVehicleID || -1,
    };
    if (this.expendAtSortOrder) {
      searchData.expend_at_order = this.expendAtSortOrder;
    }

    this._expenditureSvc.list(this.pageIndex, this.pageSize, searchData).subscribe({
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

  openEditor(item?: IExpenditure): void {
    this.editorVisible = true;
    this.isEditMode = false;
    this.editId = 0;
    this.editorTitle = this._translate.instant('global.add');
    if (item) {
      this.typeCtrl.setValue(item.type);
      this.timeCtrl.setValue(new Date(item.expend_at));
      this.costCtrl.setValue(item.cost);
      this.vehicleCtrl.setValue(item.vehicle_id);
      this.commentCtrl.setValue(item.comment);
      this.isEditMode = true;
      this.editId = item.id;
      this.editorTitle = this._translate.instant('global.edit');
    }
  }

  handleCancel() {
    this.editorVisible = false;
    if (this.isEditMode) {
      this.selfFormGroup.reset();
    }
  }

  handleSave() {
    const data = {
      type: this.typeCtrl.value,
      expend_at: moment(this.timeCtrl.value).format('YYYY-MM-DD'),
      cost: this.costCtrl.value || 0,
      vehicle_id: this.vehicleCtrl.value,
      comment: this.commentCtrl.value,
      id: 0
    };
    let submit = this._expenditureSvc.create;
    if (this.isEditMode) {
      submit = this._expenditureSvc.update;
      data.id = this.editId;
    }
    submit.bind(this._expenditureSvc)(data).subscribe({
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
      nzTitle: this._translate.instant('expenditure.delete-title'),
      nzContent: this._translate.instant('expenditure.delete-confirm'),
      nzOkText: this._translate.instant('global.yes'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this._expenditureSvc.delete(id).subscribe({
          next: () => {
            this._message.success(this._translate.instant('global.delete-success'));
            this.list();
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
