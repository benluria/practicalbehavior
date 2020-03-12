import { Component, OnInit } from '@angular/core';
import { AppContentTable } from 'src/app/models/app-content.model';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-aba',
  templateUrl: './aba.component.html',
  styleUrls: ['./aba.component.scss']
})
export class AbaComponent implements OnInit {
  appContent: AppContentTable;

  constructor(
    private contentService: AppContentService,
    private title: Title,
    private meta: Meta
    ) { }

  async ngOnInit() {
    this.appContent = await this.contentService.getContentForPage(PAGES.whatIsABA);
    this.title.setTitle(this.contentService.removeTags(this.appContent['Title']));
    this.meta.updateTag({name: 'description', content: 'Applied Behavior Analysis (ABA) is an approach to changing socially significant behavior using the principles of learning and is a prominent treatment for individuals with autism and intellectual disabilities. The field of ABA is backed by over 50 years of clinical research published in peer-reviewed scholarly journals.'}, `name='description'`);
  }

}
