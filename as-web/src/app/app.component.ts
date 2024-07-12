import {Component} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {en_US, zh_CN, NzI18nService} from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = '中辉运输记账系统';

  constructor(
    private _translate: TranslateService,
    private _i18n: NzI18nService
  ) {
    console.log(`browser languages reported: ${navigator.languages}`);
    console.log(`setting user default language of : ${navigator.language}`);

    const languageFamily = navigator.language.split('-'); // always use the base language vs. language-tag
    _translate.use(languageFamily[0]); // current language use
    let lang= zh_CN;
    if (languageFamily[0] === 'en') {
      lang = en_US;
    }
    _i18n.setLocale(lang);
  }
}
