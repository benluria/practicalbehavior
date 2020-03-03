import { Component, OnInit } from '@angular/core';
import { AppContentTable } from 'src/app/models/app-content.model';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';

@Component({
  selector: 'app-aba',
  templateUrl: './aba.component.html',
  styleUrls: ['./aba.component.scss']
})
export class AbaComponent implements OnInit {
  appContent: AppContentTable;

  constructor(private contentService: AppContentService) { }

  async ngOnInit() {
    this.appContent = await this.contentService.getContentForPage(PAGES.whatIsABA);
  }

}
