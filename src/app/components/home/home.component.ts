import { Component, OnInit } from '@angular/core';
import { AppContent, AppContentTable } from 'src/app/models/app-content.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from '../../models/pages.const';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  appContent: AppContentTable = {};

  tiles: AppContent[] = [];

  constructor(public domSanitizer: DomSanitizer, 
              private contentService: AppContentService) { }

  async ngOnInit() {
    Promise.all([
      this.contentService.getContentForPage(PAGES.home),
      this.contentService.retrieveContent()
    ]).then((response) => {
      this.appContent = response[0];

      let tilesRaw = response[1];
      tilesRaw = tilesRaw.filter(x => x.page == PAGES.home && x.description.indexOf('TILE:') >= 0);
      tilesRaw.forEach(tile => {
        tile.description = tile.description.replace('TILE:', '');
        this.tiles.push(tile);
      });
    });
  }
}
