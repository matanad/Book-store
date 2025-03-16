import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';


@NgModule({
  declarations: [
    AccountComponent,
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
