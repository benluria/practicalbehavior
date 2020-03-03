import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState } from '@angular/platform-browser';

import { AppContentTable, AppContent } from '../models/app-content.model';
import  { CACHE_KEYS } from '../models/cache-keys.const';

import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class AppContentService {
  appContent: AppContent[];
  employees: Employee[];
  loadInProgress = false;

  constructor(private http: HttpClient, 
              private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId: Object ) { }

  // call for page content
  async getContentForPage(page: string): Promise<AppContentTable> {
    const content = await this.retrieveContent();
    
    if (!content) return {};
    return this.filterContentByPage(content, page);
  }

  private filterContentByPage(content: AppContent[], page: string) {
    const contentTable: AppContentTable = {};
    const pageContent = content.filter(x => x.page == page);

    pageContent.forEach(item => {
      contentTable[item.description] = item.content;
    });

    return contentTable;
  }

  // retrieve content from api
  async retrieveContent(refreshCache = false): Promise<AppContent[]> {
    try {
      if (this.appContent != null && this.appContent.length > 0 && !refreshCache) {
        return this.appContent;
      }
      
      console.log('TRANSFER STATE HAS KEY: ', this.transferState.hasKey(CACHE_KEYS.content));
      if (this.transferState.hasKey(CACHE_KEYS.content) && !refreshCache) {
        const res: AppContent[] = JSON.parse(this.transferState.get<string>(CACHE_KEYS.content, '[]'));
        return res;
      }

      if (isPlatformBrowser(this.platformId) && !refreshCache) {
        if (sessionStorage.getItem(CACHE_KEYS.content)) {
          console.log('SESSION STORAGE HAS VALUE: CONTENT');
          this.appContent = JSON.parse(sessionStorage.getItem(CACHE_KEYS.content));
          return this.appContent;
        }
      }

      console.log('CALLING API');
      const content = await this.http.get<AppContent[]>(`${environment.apiUrl}/app-content`).toPromise();
      if (content) {
        this.transferState.set<string>(CACHE_KEYS.content, JSON.stringify(content));
        if (isPlatformBrowser(this.platformId)) sessionStorage.setItem(CACHE_KEYS.content, JSON.stringify(content));
        
        this.appContent = content;
        return content;
      }
    } catch (err) {
      console.error(err);
      // put up an error page...? 
      // send an email to notify me...
    }
  }

  async updateContent(id: number, content: string): Promise<boolean> {
    console.log('CALLING API');
    try {
      const success = await this.http.put<boolean>(`${environment.apiUrl}/app-content`, {id, content}).toPromise();
      if (success) {
        await this.retrieveContent(true);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  }

  async getEmployees() {
    if (!this.employees) {
      const employees = await this.http.get<Employee[]>(`${environment.apiUrl}/employees`).toPromise();
      this.employees = employees;
    }
    return this.employees;
  }

  async saveEmployee(employee: Employee) {
    const resp = await this.http.post(`${environment.apiUrl}/employee`, {employee}).toPromise();
    this.employees = null;
    return resp;
  }

  async deleteEmployee(id: number) {
    const resp = await this.http.delete(`${environment.apiUrl}/employee?id=${id}`).toPromise();
    this.employees = null;
    return resp;
  }
}
