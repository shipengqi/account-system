import {NzResultStatusType} from 'ng-zorro-antd/result/result.component';
import {NzButtonType} from 'ng-zorro-antd/button/button.component';

export interface ExceptionData {
  status: NzResultStatusType;
  title: string;
  desc: string;
}

export interface BackButtonData {
  type: NzButtonType;
  name: string;
}
