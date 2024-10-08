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

import {IOrder, OrderSearchData} from "../../shared/model/order";
import {VehiclesService} from "../../shared/services/vehicles.service";
import {IProject, IVehicle, IDriver} from "../../shared/model/model";
import {DriversService} from "../../shared/services/drivers.service";
import {ProjectsService} from "../../shared/services/projects.service";
import {OrdersService} from "../../shared/services/orders.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.less'
})
export class OrdersComponent implements OnInit {
  searchUnLoadTime: string[] = [];
  searchDriverID: number = -1;
  searchProjectID: number = -1;
  searchVehicleID: number = -1;

  selfFormGroup = new FormGroup({});
  projectCtrl: AbstractControl = new UntypedFormControl();
  vehicleCtrl: AbstractControl = new UntypedFormControl();
  driverCtrl: AbstractControl = new UntypedFormControl();
  unloadTimeCtrl: AbstractControl = new UntypedFormControl();
  freightCtrl: AbstractControl = new UntypedFormControl();
  weightCtrl: AbstractControl = new UntypedFormControl();
  payrollCtrl: AbstractControl = new UntypedFormControl();
  commentCtrl: AbstractControl = new UntypedFormControl();

  editorTitle = '';
  editorVisible = false;
  editorSaving = false;
  isEditMode = false;
  editId = 0;
  projectList: IProject[] = [];
  vehicleList: IVehicle[] = [];
  driverList: IDriver[] = [];
  isVehicleLoading = false;
  isProjectLoading = false;
  isDriverLoading = false;

  tableLoading = true;
  unloadAtSortOrder: string|null = null;
  unloadAtSortDirections = ['ascend', 'descend', null];
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  items: IOrder[] = [];

  constructor(
    private _modal: NzModalService,
    private _translate: TranslateService,
    private _message: NzMessageService,
    private _vehicleSvc: VehiclesService,
    private _driversSvc: DriversService,
    private _projectSvc: ProjectsService,
    private _ordersSvc: OrdersService
  ) {}

  ngOnInit() {
    this.selfFormGroup.addControl(
      'project',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'driver',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'vehicle-number',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'unload-time',
      new FormControl(moment().format('YYYY-MM-DD'), [Validators.required])
    );
    this.selfFormGroup.addControl(
      'weight',
      new FormControl(0, [Validators.min(0)])
    );
    this.selfFormGroup.addControl(
      'freight',
      new FormControl(0, [Validators.min(0)])
    );
    this.selfFormGroup.addControl(
      'payroll',
      new FormControl(0, [Validators.min(0)])
    );
    this.selfFormGroup.addControl(
      'comment',
      new FormControl('', [Validators.maxLength(256)])
    );

    this.projectCtrl = this.selfFormGroup.get('project') as AbstractControl;
    this.vehicleCtrl = this.selfFormGroup.get('vehicle-number') as AbstractControl;
    this.driverCtrl = this.selfFormGroup.get('driver') as AbstractControl;
    this.unloadTimeCtrl = this.selfFormGroup.get('unload-time') as AbstractControl;
    this.weightCtrl = this.selfFormGroup.get('weight') as AbstractControl;
    this.freightCtrl = this.selfFormGroup.get('freight') as AbstractControl;
    this.payrollCtrl = this.selfFormGroup.get('payroll') as AbstractControl;
    this.commentCtrl = this.selfFormGroup.get('comment') as AbstractControl;

    this.list();
    this.loadVehicles();
    this.loadProjects();
    this.loadDrivers();
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

  loadProjects(): void {
    this.isProjectLoading = true;
    this._projectSvc.listAll().subscribe({
      next: (res) => {
        this.isProjectLoading = false;
        this.projectList = res.items;
      },
      error: (err) => {
        this.isProjectLoading = false;
        this.projectList = [];
      }
    });
  }

  loadDrivers(): void {
    this.isDriverLoading = true;
    this._driversSvc.listAll().subscribe({
      next: (res) => {
        this.isDriverLoading = false;
        this.driverList = res.items;
      },
      error: (err) => {
        this.isDriverLoading = false;
        this.driverList = [];
      }
    });
  }

  search() {
    this.list();
  }

  openEditor(item?: IOrder) {
    this.editorVisible = true;
    this.isEditMode = false;
    this.editId = 0;
    this.editorTitle = this._translate.instant('global.add');
    if (item) {
      this.projectCtrl.setValue(item.project_id);
      this.vehicleCtrl.setValue(item.vehicle_id);
      this.driverCtrl.setValue(item.driver_id)
      this.unloadTimeCtrl.setValue(new Date(item.unload_at));
      this.weightCtrl.setValue(item.weight);
      this.freightCtrl.setValue(item.freight);
      this.payrollCtrl.setValue(item.payroll);
      this.commentCtrl.setValue(item.comment);
      this.isEditMode = true;
      this.editId = item.id;
      this.editorTitle = this._translate.instant('global.edit');
    }
  }

  list() {
    this.tableLoading = true;

    const searchData: OrderSearchData = {
      unload_range: this.searchUnLoadTime || [],
      project_id: this.searchProjectID || -1,
      vehicle_id: this.searchVehicleID || -1,
      driver_id: this.searchDriverID || -1,
    };
    if (this.unloadAtSortOrder) {
      searchData.unload_at_order = this.unloadAtSortOrder;
    }

    this._ordersSvc.list(this.pageIndex, this.pageSize, searchData).subscribe({
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
    if (this.isEditMode) {
      this.selfFormGroup.reset();
    }
  }

  handleSave() {
    const data = {
      project_id: this.projectCtrl.value,
      vehicle_id: this.vehicleCtrl.value,
      driver_id: this.driverCtrl.value,
      unload_at: moment(this.unloadTimeCtrl.value).format('YYYY-MM-DD'),
      freight: this.freightCtrl.value || 0,
      payroll: this.payrollCtrl.value || 0,
      weight: this.weightCtrl.value || 0,
      comment: this.commentCtrl.value,
      load_at: moment(this.unloadTimeCtrl.value).format('YYYY-MM-DD'), // Todo use real load time
      id: 0
    };
    let submit = this._ordersSvc.create;
    if (this.isEditMode) {
      submit = this._ordersSvc.update;
      data.id = this.editId;
    }
    submit.bind(this._ordersSvc)(data).subscribe({
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
        this._ordersSvc.delete(id).subscribe({
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
}
