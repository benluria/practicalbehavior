import { Component, OnInit } from '@angular/core';
import { AppContent, AppContentTable } from 'src/app/models/app-content.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from '../../models/pages.const';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  appContent: AppContentTable = {};

  tiles: AppContent[] = [];

  constructor(public domSanitizer: DomSanitizer, 
              private contentService: AppContentService,
              private router: Router) { }

  async ngOnInit() {
    Promise.all([
      this.contentService.getContentForPage(PAGES.home),
      this.contentService.retrieveContent()
    ]).then((response) => {
      this.appContent = response[0];

      let tilesRaw = response[1];
      tilesRaw = tilesRaw.filter(x => x.page == PAGES.home && x.description.indexOf('TILE:') >= 0);
      tilesRaw.forEach(tile => {
        const copy = Object.assign({}, tile);
        copy.description = copy.description.replace('TILE:', '');
        this.tiles.push(copy);
      });
    });
  }

  goToPage(page: string) {
    this.router.navigate([page]);
  }
}
