import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ListContentComponent } from './components/list-content/list-content.component';
import { ReferralComponent } from './components/referral/referral.component';
import { ServicesComponent } from './components/services/services.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ContactComponent } from './components/contact/contact.component';
import { AbaComponent } from './components/aba/aba.component';
import { AboutComponent } from './components/about/about.component';

import { AuthService } from './services/auth.service';
import { DialogService } from './services/dialog.service';
import { AppContentService } from './services/app-content.service';
import { ReferralService } from './services/referral.service';

import { AuthGuard } from './helpers/auth-guard';
import { CanDeactivateGuard } from './helpers/auth-deactivate';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { BrowserStateInterceptor } from './broswerstate.interceptor';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'practical-behavior' }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserTransferStateModule,
    AngularEditorModule,
    ReactiveFormsModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    ListContentComponent,
    ReferralComponent,
    ServicesComponent,
    ResourcesComponent,
    ContactComponent,
    AbaComponent,
    AboutComponent
  ],
  providers: [ 
    AuthService, 
    DialogService, 
    AppContentService,
    ReferralService,
    AuthGuard, 
    CanDeactivateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserStateInterceptor,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
