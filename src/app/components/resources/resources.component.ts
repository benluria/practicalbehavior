import { Component, OnInit } from '@angular/core';
import { AppContentTable } from 'src/app/models/app-content.model';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  appContent: AppContentTable;

  constructor(
    private contentService: AppContentService,
    private title: Title,
    private meta: Meta
    ) { }

  async ngOnInit() {
    this.appContent = await this.contentService.getContentForPage(PAGES.resources);
    this.title.setTitle(this.contentService.removeTags(this.appContent['Title']));
    // this.meta.updateTag({name: 'description', content: this.contentService.removeTags(this.appContent['Main Text'])}, `name='description'`);
  }

}
