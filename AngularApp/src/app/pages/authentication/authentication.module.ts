import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UISupportModule } from './../../modules/ui-support/ui-support.module';
import { FormSupportModule } from './../../modules/form-support/form-support.module';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

@NgModule({
	imports: [
		CommonModule,
		AuthenticationRoutingModule,
		UISupportModule,
		FormSupportModule
	],
  	declarations: [AuthenticationComponent, AdminPanelComponent]
})
export class AuthenticationModule { }
