import {Component, OnInit} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  UntypedFormControl
} from "@angular/forms";

import moment from "moment";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {TranslateService} from "@ngx-translate/core";

import {IProject} from "../../shared/model/model";
import {ProjectsService} from "../../shared/services/projects.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.less'
})
export class ProjectsComponent implements OnInit {
  tableLoading = true;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  items: IProject[] = [];

  editorTitle = '';
  editorVisible = false;
  editorSaving = false;
  isEditMode = false;
  editId = 0;

  selfFormGroup = new FormGroup({});
  nameCtrl: AbstractControl = new UntypedFormControl();
  commentCtrl: AbstractControl = new UntypedFormControl();

  constructor(
    private _modal: NzModalService,
    private _message: NzMessageService,
    private _translate: TranslateService,
    private _projectsSvc: ProjectsService
  ) {}

  ngOnInit() {
    this.selfFormGroup.addControl(
      'name',
      new FormControl('', [Validators.required])
    );
    this.selfFormGroup.addControl(
      'comment',
      new FormControl('', [Validators.maxLength(256)])
    );

    this.nameCtrl = this.selfFormGroup.get('name') as AbstractControl;
    this.commentCtrl = this.selfFormGroup.get('comment') as AbstractControl;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.list();
  }

  openEditor(item?: IProject) {
    this.editorVisible = true;
    this.isEditMode = false;
    this.editId = 0;
    this.editorTitle = this._translate.instant('global.add');
    if (item) {
      this.nameCtrl.setValue(item.name);
      this.commentCtrl.setValue(item.comment);
      this.isEditMode = true;
      this.editId = item.id;
      this.editorTitle = this._translate.instant('global.edit');
    }
  }

  list() {
    this.tableLoading = true;
    this._projectsSvc.list(this.pageIndex, this.pageSize).subscribe({
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
      comment: this.commentCtrl.value,
      start_at: moment().format('YYYY-MM-DD'),   // Todo real date
      end_at: moment().format('YYYY-MM-DD'),
      id: 0
    };
    let submit = this._projectsSvc.create;
    if (this.isEditMode) {
      submit = this._projectsSvc.update;
      data.id = this.editId;
    }
    submit.bind(this._projectsSvc)(data).subscribe({
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
      nzTitle: this._translate.instant('project.delete-title'),
      nzContent: this._translate.instant('project.delete-confirm'),
      nzOkText: this._translate.instant('global.yes'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this._projectsSvc.delete(id).subscribe({
          next: () => {
            this._message.success(this._translate.instant('global.delete-success'));
            this.list();
          }
        });
      },
      nzCancelText: this._translate.instant('global.cancel'),
      nzOnCancel: () => console.log('project delete cancel')
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
