import { Component, HostListener, OnInit } from '@angular/core';
import { AppContentTable } from './models/app-content.model';
import { AppContentService } from './services/app-content.service';

import { PAGES } from './models/pages.const';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appContent: AppContentTable = {};

  showHeaderBackground = false;
  year = new Date().getFullYear();
  footerPhone: string;
  footerEmail: string;

  username: string;
  password: string;

  showEmployeeLogin = false;
  isLoggedIn: boolean;

  @HostListener('window:scroll', ['$event']) public onScroll($event:Event):void {
    if (this.router.url == '/admin') {
      this.showHeaderBackground = true;
      return;
    }

    this.showHeaderBackground = window.pageYOffset > 10;
  };

  navItems = [
    {
      title: 'About Us',
      link: 'about'
    },
    {
      title: 'Services Provided',
      link: 'services'
    },
    {
      title: 'What is ABA?',
      link: 'aba'
    },
    {
      title: 'Resources',
      link: 'resources'
    },
    {
      title: 'Contact Us',
      link: 'contact'
    },
    {
      title: 'Submit a Referral',
      link: 'referral'
    }
  ];

  constructor(private contentService: AppContentService, 
              private authService: AuthService,
              private router: Router) {  }

  async ngOnInit() {
    this.appContent = await this.contentService.getContentForPage(PAGES.footer);
    this.isLoggedIn = this.authService.hasToken();
  }

  async login() {
    if (this.username && this.password) {
      const resp = await this.authService.login(this.username, this.password);
      if (resp) {
        this.showEmployeeLogin = false;
        this.showHeaderBackground = true;
        this.isLoggedIn = this.authService.hasToken();
        this.router.navigate(['/admin']);
      } else {
        //show error;
      }
    }
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

}
