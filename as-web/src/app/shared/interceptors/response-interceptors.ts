import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private _message: NzMessageService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        let errorMessage;
        if (err instanceof ErrorEvent) {
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          // alert the error, then throws the error so that the caller can handle it
          if (err.error && err.error.code) {
            this._message.error(err.error.message);
            return throwError(() => err.error);
          }
          errorMessage = `Server returned code: ${err.status}, with message: ${err.message}`;
        }
        return throwError(() => `Network Error: ${errorMessage}`);
      }),
    );
  }
}
