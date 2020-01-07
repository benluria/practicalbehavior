import { Component, OnInit, SecurityContext } from '@angular/core';
import { AppContentTable } from 'src/app/models/app-content.model';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  appContent: AppContentTable = {};
  checkboxes = [];
  other = false;

  didd = false;
  personFillingOutForm = true;
  
  guardian = true;
  guardianPhone = false;
  guardianEmail = false;
  guardianAM = false;
  guardianPM = false;
  
  constructor(private contentService: AppContentService,
              private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    this.appContent = await this.contentService.getContentForPage(PAGES.referral);
    console.log(this.appContent);
    this.checkboxes = [ 
      {
        label: 'Physical Aggression (Any instance of harming, or attempting to harm, another individual)',
        checked: false
      },
      {
        label: 'Self-Injurious Behaviors (Any instance of harming, or attempting to harm, self)',
        checked: false
      },
      {
        label: 'Elopement (Any instance of leaving, or attempting to leave, the supervised area)',
        checked: false
      },
      {
        label: 'PICA (Any instance of ingesting, or attempting to ingest, inedible objects)',
        checked: false
      },
      {
        label: 'Tantrum (Any instance of crying, screaming, yelling, throwing things, or falling to the floor)',
        checked: false
      },
      {
        label: 'Verbal Aggression (Any instance of yelling, screaming, or cursing at another individual)',
        checked: false
      },
      {
        label: 'Noncompliance (Any instance of not complying with necessary instructions provided by a caregiver)',
        checked: false
      }
    ];
  }

  submit() {
    const sanitizedString = this.sanitizer.sanitize(SecurityContext.HTML, '');
  }

}
