import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

const captchaClickBasicUrl = './api/v1/captcha/click-basic';
const captchaSlideBasicUrl = './api/v1/captcha/slide-basic';
const captchaRotateBasicUrl = './api/v1/captcha/rotate-basic';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor(private _http: HttpClient) {}

  getClickBasic(): Observable<any> {
    return this._http.get<any>(captchaClickBasicUrl);
  }

  confirmClickBasicData(dots: any, key: string): Observable<any> {
    const dotArr = []
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i]
      dotArr.push(dot.x, dot.y)
    }

    return this._http.post<any>(captchaClickBasicUrl, {
      dots: dotArr.join(','),
      key: key
    });
  }

  getSlideBasic(): Observable<any> {
    return this._http.get<any>(captchaSlideBasicUrl);
  }

  confirmSlideBasicData(point: any, key: string): Observable<any> {
    return this._http.post<any>(captchaSlideBasicUrl, {
      point: [point.x, point.y].join(','),
      key: key
    });
  }

  getRotateBasic(): Observable<any> {
    return this._http.get<any>(captchaRotateBasicUrl);
  }

  confirmRotateBasicData(angle: any, key: string): Observable<any> {
    return this._http.post<any>(captchaRotateBasicUrl, {
      angle: angle,
      key: key
    });
  }
}
