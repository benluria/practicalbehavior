import { Component, OnInit } from '@angular/core';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { AppContentTable } from 'src/app/models/app-content.model';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  appContent: AppContentTable;
  services: Service[];
  
  constructor(private contentService: AppContentService) { }

  async ngOnInit() {
    const resp = await Promise.all([
      this.contentService.getContentForPage(PAGES.servicesProvided),
      this.contentService.getServices()
    ]);
    this.appContent = resp[0];
    this.services = resp[1];
    console.log(this.services);
  }

}
