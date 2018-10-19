import { CanActivate } from '@angular/router';
import {Injectable} from "@angular/core";
import {SettingsService} from "../core/settings/settings.service";

@Injectable()
export class CanActivateTutor implements CanActivate {
	constructor(public settings: SettingsService) {}

	canActivate(): boolean {
		return Boolean(this.settings.user.tutorCode);
	}
}