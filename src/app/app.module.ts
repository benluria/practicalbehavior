import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ListContentComponent } from './components/list-content/list-content.component';

import { AuthService } from './services/auth.service';
import { DialogService } from './services/dialog.service';
import { AppContentService } from './services/app-content.service';

import { AuthGuard } from './helpers/auth-guard';
import { CanDeactivateGuard } from './helpers/auth-deactivate';


@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'practical-behavior' }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TransferHttpCacheModule,
    BrowserTransferStateModule,
    AngularEditorModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    ListContentComponent
  ],
  providers: [ 
    AuthService, 
    DialogService, 
    AppContentService,
    AuthGuard, 
    CanDeactivateGuard 
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
