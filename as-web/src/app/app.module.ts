import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  withFetch,
  HttpBackend,
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import {CommonModule} from '@angular/common';

import {IconDefinition} from '@ant-design/icons-angular';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutModule} from './core/layout';
import {SharedModule} from './shared/shared.module';
import {BasicComponent} from './basic.component';
import {ACLModule} from './core/acl';
import {ResponseInterceptor} from "./shared/interceptors/response-interceptors";

import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';

registerLocaleData(en);
registerLocaleData(zh);

// Import what you need. RECOMMENDED.
// Todo should use this for release version
// import { AccountBookFill, AlertFill, AlertOutline } from '@ant-design/icons-angular/icons';
// const icons: IconDefinition[] = [ AccountBookFill, AlertOutline, AlertFill ];

// Import all. NOT RECOMMENDED.
import * as AllIcons from '@ant-design/icons-angular/icons';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";


const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

// AoT requires an exported function for factories
export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    {prefix: './assets/i18n/', suffix: '.json'}
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    BasicComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzIconModule.forRoot(icons),
    LayoutModule,
    SharedModule,
    NzButtonModule,
    NzInputModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    ACLModule.forRoot({}),
    NzAvatarComponent
  ],
  providers: [
    NzMessageService,
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(), // DI-based interceptors must be explicitly enabled.
    ),
    {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
