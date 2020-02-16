import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './helpers/auth-guard';
import { CanDeactivateGuard } from './helpers/auth-deactivate';
import { ListContentComponent } from './components/list-content/list-content.component';
import { ReferralComponent } from './components/referral/referral.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/services/services.component';
import { AbaComponent } from './components/aba/aba.component';
import { ResourcesComponent } from './components/resources/resources.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'admin/:page',
    component: ListContentComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'aba',
    component: AbaComponent
  },
  {
    path: 'referral',
    component: ReferralComponent
  },
  {
    path: 'resources',
    component: ResourcesComponent
  }
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
