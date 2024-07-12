import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import {preloaderFinished} from './app/core/utils';

preloaderFinished();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(res => {
    const win = window as any;
    if (win && win.appBootstrap) {
      win.appBootstrap();
    }
  })
  .catch(err => console.error(err));
