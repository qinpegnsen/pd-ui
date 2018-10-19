import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {PagesComponent} from './pages/pages.component';
import {SharedModule} from "../../shared/shared.module";
import {SettingsService} from "../../core/settings/settings.service";
import {PatternService} from "../../core/forms/pattern.service";
import {AjaxService} from "../../core/services/ajax.service";
import {TutorLoginComponent} from './tutor-login/tutor-login.component';
import { PaySuccessComponent } from './pay-success/pay-success.component';
import { PayCancelComponent } from './pay-cancel/pay-cancel.component';
import {TutorInitComponent} from "./tutor-init/tutor-init.component";
import {CookieService} from "angular2-cookie/services";
import {SendEmailComponent} from "./send-email/send-email.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {RegisterTotalComponent} from "../student/register-total/register-total.component";

@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	declarations: [
		PagesComponent,
		LoginComponent,
		TutorLoginComponent,
		PaySuccessComponent,
		PayCancelComponent,
		TutorInitComponent,
		SendEmailComponent,
		ResetPasswordComponent,
		RegisterTotalComponent
	],
	providers: [PatternService, AjaxService, CookieService],
	exports: [
		PagesComponent,
		LoginComponent,
		TutorLoginComponent,
		PaySuccessComponent,
		TutorInitComponent
	]
})
export class PagesModule {
}

