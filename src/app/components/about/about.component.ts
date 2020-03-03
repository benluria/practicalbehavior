import { Component, OnInit } from '@angular/core';

import { Employee } from '../../models/employee.model';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { AppContentTable } from 'src/app/models/app-content.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  appContent: AppContentTable;
  employees: Employee[]

  constructor(private contentService: AppContentService) { }

  async ngOnInit() {
    const resp = await Promise.all([
      this.contentService.getContentForPage(PAGES.about),
      this.contentService.getEmployees()
    ]);
    
    this.appContent = resp[0]
    this.employees = resp[1]
  }

}
