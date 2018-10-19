import {Component, OnInit} from '@angular/core';
import {SettingsService} from "../../../../core/settings/settings.service";
import {TranslateService} from "@ngx-translate/core";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
import {CookieService} from "angular2-cookie/core";

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	languageList: Array<any> = SettingsService.language; //获取国际化语言列表
	selLanguage: string; //选中的语言

	constructor(public translate: TranslateService, public tools: RzhtoolsService, public settings: SettingsService, public cookieService: CookieService) {
	}

	ngOnInit() {
		let _this = this, sell = SettingsService.selectLanguage,
			i18nInfo = _this.cookieService.get(SettingsService.i18nSelLanguage);
		if (sell) _this.selLanguage = sell;
		else if (i18nInfo) sell = _this.selLanguage = i18nInfo;
		else sell = _this.selLanguage = _this.translate.getBrowserLang() || "en"; //国际化语言
		_this.translate.use(_this.selLanguage);
	}

	/**
	 * 修改语言
	 */
	editLanguage() {
		let _this = this;
		SettingsService.selectLanguage = _this.selLanguage; //设置选中的语言信息
		_this.cookieService.put(SettingsService.i18nSelLanguage, _this.selLanguage); //設置cookie信息
		_this.settings.checkMenu();
		_this.translate.use(_this.selLanguage);
		_this.tools.getI18nInfos(_this.selLanguage); //获取国际化信息
	}

}
