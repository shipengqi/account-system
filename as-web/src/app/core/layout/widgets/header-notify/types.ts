import type {NzSafeAny} from 'ng-zorro-antd/core/types';

export interface NoticeListItem {
  [key: string]: NzSafeAny;

  /** 头像图片链接 */
  avatar?: string;

  /** 头像 icon */
  avatarIcon?: string;

  /** 标题 */
  // title?: string | TemplateRef<{ $implicit: NoticeListItem }>;
  title?: string;

  /** 描述信息 */
  // description?: string | TemplateRef<{ $implicit: NoticeListItem }>;
  description?: string;

  /** 时间戳 */
  datetime?: string | Date | number;

  /** 额外信息，在列表项右上角 */
  extra?: string;

  /** 是否已读状态 */
  read?: boolean;
}

export interface NoticeSelect {
  title: string;
  item: NoticeListItem;
}
