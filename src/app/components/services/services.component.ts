import { Component, OnInit } from '@angular/core';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { AppContentTable } from 'src/app/models/app-content.model';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  appContent: AppContentTable;
  
  constructor(private contentService: AppContentService) { }

  async ngOnInit() {
    this.appContent = await this.contentService.getContentForPage(PAGES.servicesProvided);
  }

}
