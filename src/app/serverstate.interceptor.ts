import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as memoryCache from 'memory-cache';
import { of } from 'rxjs';

@Injectable()
export class ServerStateInterceptor implements HttpInterceptor {
    constructor(private transferState: TransferState) {}

    intercept(req:HttpRequest<any>, next: HttpHandler) {
        const cachedData = memoryCache.get(req.url);
        if (cachedData) {
          this.transferState.set(makeStateKey(req.url), cachedData);
            return of(new HttpResponse({ body: cachedData, status: 200 }));
        }

        return next.handle(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                this.transferState.set(makeStateKey(req.url), event.body);
                memoryCache.put(req.url, event.body);
            }
        }))
    }
}