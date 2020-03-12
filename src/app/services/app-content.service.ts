import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';
import { Service } from '../models/service.model';
import { AppContentTable, AppContent } from '../models/app-content.model';
import { TransferState } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppContentService {
  appContent: AppContent[];
  employees: Employee[];
  services: Service[];
  loadInProgress = false;

  constructor(private http: HttpClient, private transferState: TransferState) { }

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
      
      const response = await Promise.all([
        this.http.get<AppContent[]>(`${environment.apiUrl}/app-content`).toPromise(),
        this.getServices(),
        this.getEmployees()
      ]);

      if (response) {
        this.appContent = response[0];
        return response[0];
      }

    } catch (err) {
      console.error(err);
      // put up an error page...? 
      // send an email to notify me...
    }
  }

  async updateContent(id: number, content: string): Promise<boolean> {
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
      this.employees = await this.http.get<Employee[]>(`${environment.apiUrl}/employees`).toPromise();
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

  async getServices() {
    if (!this.services) {
      this.services = await this.http.get<Service[]>(`${environment.apiUrl}/services`).toPromise();
    }
    return this.services;
  }

  async saveService(service: Service) {
    const resp = await this.http.post(`${environment.apiUrl}/service`, {service}).toPromise();
    this.services = null;
    return resp;
  }

  async deleteService(id: number) {
    const resp = await this.http.delete(`${environment.apiUrl}/service?id=${id}`).toPromise();
    this.services = null;
    return resp;
  }
}
