import { Injectable, OnInit, PLATFORM_ID, Inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { CACHE_KEYS } from '../models/cache-keys.const';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  redirectUrl: string; // store the URL so we can redirect after logging in
  
  constructor(private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {

  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem(CACHE_KEYS.token);
      if (token) {
        const newToken = await this.refreshToken(token);
        if (newToken) {
          sessionStorage.setItem(CACHE_KEYS.token, newToken);
        } else {
          sessionStorage.removeItem(CACHE_KEYS.token);
        }
      }
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    const resp = await this.http.post<any>(`${environment.apiUrl}/login`, {username, password}).toPromise();
    console.log('login', resp);
    if (resp && resp.success) {
      if (isPlatformBrowser(this.platformId) && resp.token) 
        sessionStorage.setItem(CACHE_KEYS.token, resp.token);
        
      return resp.success;
    }

    return false;
  }

  async refreshToken(token: string) {
    const resp = await this.http.post<any>(`${environment.apiUrl}/login`, {token}).toPromise();
    console.log('refresh', resp);
    if (resp && resp.success) {
      return resp.token;
    }
    return null;
  }

  hasToken() {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(CACHE_KEYS.token) != null;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(CACHE_KEYS.token);
  }
}