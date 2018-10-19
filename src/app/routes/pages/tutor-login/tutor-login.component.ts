import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {SettingsService} from "../../../core/settings/settings.service";
import {AjaxService} from "../../../core/services/ajax.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {MaskService} from "../../../core/services/mask.service";
import {Router} from "@angular/router";
import {CookieService} from "angular2-cookie/core";
import {PatternService} from "../../../core/forms/pattern.service";
declare var $:any;
const swal = require('sweetalert');

@Component({
	selector: 'app-tutor-login',
	templateUrl: './tutor-login.component.html',
	styleUrls: ['./tutor-login.component.css']
})
export class TutorLoginComponent implements OnInit {

	constructor(public settings: SettingsService, public cookieService: CookieService, public patterns: PatternService, public ajax: AjaxService, public router: Router, public tools: RzhtoolsService, public location: Location) {
	}

	ngOnInit() {
		this.checkLogin();
	}

	/**
	 * 登录检测   如果教师的登录信息存在则直接跳转到goods页面
	 */
	public checkLogin() {
		const url = this.location.path();
		// const loginCookie = this.cookieService.getObject('tutorInfo'),                    // 获取用户信息
		const sessionId = this.cookieService.get(SettingsService.sessionId);                   // 获取登陆状态
		if (url == '/pages/tutorLogin' && sessionId) this.router.navigate(['/goods'], {replaceUrl: true}); // 路由跳转
		// if (loginCookie) Object.assign(this.settings.user, loginCookie);
	}

	/**
	 * 教师登录
	 * @param formData              教师登录信息
	 */
	tutorLoginIn(formData) {
		if (formData.valid) {
			const me = this;
			MaskService.showMask();
			let data = {},
				email = new RegExp(me.patterns.email),       // email正则
				phone = new RegExp(me.patterns.phone);       // 手机正则
			if(email.test($.trim(formData.value.username))){          // 判断用户输入为email还是手机
				data = {email: $.trim(formData.value.username), password: $.trim(formData.value.password)};
			}else if ( phone.test(formData.value.username)) {
				data = {phone: $.trim(formData.value.username), password: $.trim(formData.value.password)};
			};

			me.ajax.post({
				url: '/login/tutor/signin',
				data: data,
				success: (result) => {
					MaskService.hideMask();                                                       // 关闭wait遮罩
					if (result.success) {
						let user = result.data;
						user.introduction= '';
						// me.cookieService.putObject('tutorInfo', user);                          // 用户信息存入cookie
						Object.assign(me.settings.user, user);                                        // 用户信息存入公共服务
						if(user.state === 'Reg'){                                  // 判断教师是否为注册状态如果是跳转教师修改密码页面
							me.router.navigate(['/pages/tutorInit'], {replaceUrl: true, queryParams: {isInit: true}});     // 路由跳转
						}else {
							me.router.navigate(['/manage/tutor'], {replaceUrl: true});     // 路由跳转
						}
					} else {
						swal(SettingsService.I18NINFO.swat.e112, SettingsService.I18NINFO.swat.e120, 'error');
					}
				},
				error: (result) => {
					swal(SettingsService.I18NINFO.swat.e112, SettingsService.I18NINFO.swat.e114, 'error');
				}
			});
		};
	};
}
