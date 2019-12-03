import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { CanComponentDeactivate } from 'src/app/helpers/auth-deactivate';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppContentService } from 'src/app/services/app-content.service';
import { AppContent } from 'src/app/models/app-content.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, CanComponentDeactivate {
  isUpdating = false;
  contentForm: FormGroup;
  pages: string[];
  appContent: AppContent[];

  constructor(private dialogService: DialogService,
              private contentService: AppContentService,
              private router: Router) { }

  async ngOnInit() {
    this.appContent = await this.contentService.retrieveContent();
    if (this.appContent) {
      this.pages = [...new Set(this.appContent.map(x => x.page))];
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdating && this.contentForm && this.contentForm.dirty) {
      return this.dialogService.confirm('Would you like to save your changes?');
    }
    return true;
  }

  goToPage(page: string) {
    this.router.navigate([`/admin/${page}`]);
  }
}
