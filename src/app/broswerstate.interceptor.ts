import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { of, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BrowserStateInterceptor implements HttpInterceptor {

  constructor(
    private transferState: TransferState,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const storedResponse: string = this.transferState.get(makeStateKey(req.url), null);

    if (storedResponse) {
      const response = new HttpResponse({ body: storedResponse, status: 200 });
      return of(response);
    }

    return next.handle(req);
  }
}