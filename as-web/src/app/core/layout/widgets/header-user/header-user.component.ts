import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

// Todo may need to move model directory
export interface User {
  id: string;
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-header-user',
  template: `
    <div class="layout-nav-item d-flex layout-header-items-center px-sm" nz-dropdown nzPlacement="bottomRight"
         [nzDropdownMenu]="showDropdown() ? userMenu : null">
      <nz-avatar *ngIf="user.avatar !== ''" [nzSrc]="user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      <nz-avatar *ngIf="user.avatar === ''" nzIcon="user" nzSize="small" class="mr-sm"></nz-avatar>
      {{ user.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div *ngIf="showCenter" nz-menu-item routerLink="/account/center">
          <i nz-icon nzType="user" class="mr-sm"></i>
          {{ 'header.account.center' | translate }}
        </div>
        <div *ngIf="showSettings" nz-menu-item routerLink="/account/settings">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          {{ 'header.account.settings' | translate }}
        </div>
        <li *ngIf="showLogout && (showCenter || showSettings)" nz-menu-divider></li>
        <div *ngIf="showLogout" nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'header.account.logout' | translate }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent {
  @Input() showCenter = true;
  @Input() showSettings = true;
  @Input() showLogout = true;

  get user(): User {
    return {
      id: '1',
      name: 'Admin',
      avatar: ''
    };
  }

  showDropdown(): boolean {
    return !(!this.showCenter && !this.showLogout && !this.showSettings);
  }


  // Todo clean token and redirect to login page
  logout(): void {}
}
