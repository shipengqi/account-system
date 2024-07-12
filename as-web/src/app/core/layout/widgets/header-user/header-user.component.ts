import {ChangeDetectionStrategy, Component} from '@angular/core';

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
         [nzDropdownMenu]="userMenu">
      <nz-avatar *ngIf="user.avatar !== ''" [nzSrc]="user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      <nz-avatar *ngIf="user.avatar === ''" nzIcon="user" nzSize="small" class="mr-sm"></nz-avatar>
      {{ user.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item routerLink="/account/center">
          <i nz-icon nzType="user" class="mr-sm"></i>
          {{ 'header.account.center' | translate }}
        </div>
        <div nz-menu-item routerLink="/account/settings">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          {{ 'header.account.settings' | translate }}
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'header.account.logout' | translate }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent {

  get user(): User {
    return {
      id: 'xxxxxxxxxxxxx',
      name: 'Pooky',
      avatar: ''
    };
  }


  // Todo clean token and redirect to login page
  logout(): void {}
}
