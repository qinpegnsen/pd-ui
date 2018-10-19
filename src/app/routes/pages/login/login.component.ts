import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {SettingsService} from '../../../core/settings/settings.service';
import {PatternService} from "../../../core/forms/pattern.service";
import {AjaxService} from "../../../core/services/ajax.service";
import {CookieService} from "angular2-cookie/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MaskService} from "../../../core/services/mask.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {TabsetComponent} from "ngx-bootstrap";
import {AppComponent} from "../../../app.component";
declare var $:any;

const swal = require('sweetalert');

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
	public timezones: Array<any> = new Array();
	@ViewChild('studentTabs') studentTabs: TabsetComponent;
	@ViewChild('Register') Register;
	isBack: string; //登录成功后是否返回
	public learnType: Array<any> = new Array();
	studentCode:string;//学生编码
	redirectUrl:string;  //学生如果是从官网跳转过来的话会有这个查询参数

	constructor(public activatedRoute: ActivatedRoute, public routeInfo: ActivatedRoute, public settings: SettingsService, public patterns: PatternService, public cookieService: CookieService, public ajax: AjaxService, public router: Router, public tools: RzhtoolsService, public location: Location) {
	}

	ngOnInit() {
		this.checkLogin();
		this.timezones = this.tools.getTimeZones();                    // 初始化时区
		this.isBack = this.activatedRoute.snapshot.queryParams['t']; //获取路由参数
		this.learnType = this.tools.getEnumDataList('1027');
		this.redirectUrl=localStorage.getItem('redirectUrl');
		let u = this.routeInfo.snapshot.queryParams['u']; //获取传递的值
		if (u && u == "register") this.studentTabs.tabs[1].active = true; //选中第二个标签页
	}

	/**
	 * 注册子组件发射的事件
	 */
	getTab(bol){
		if(bol){
			this.studentTabs.tabs[0].active = true;
		}
	}

	/**
	 * 登录检测
	 */
	public checkLogin() {
		const url = this.location.path();
		const sessionId = this.cookieService.get(SettingsService.sessionId);                   // 获取登陆状态
		if (url !== '/pages/login' && !sessionId) this.router.navigate(['/pages/login'], {replaceUrl: true}); // 路由跳转
		if (url == '/pages/login' && sessionId) this.router.navigate(['/goods'], {replaceUrl: true}); // 路由跳转
	}

	/**
	 * 学生登录
	 * @param formData              学生登录信息
	 */
	studentLoginIn(formData) {
		if (formData.valid) {
			const me = this;
			MaskService.showMask();
			me.ajax.post({
				url: '/login/student/signin',
				data: {email: $.trim(formData.value['student-username']), password: $.trim(formData.value['student-password'])},
				success: result => {
					MaskService.hideMask();                                                       // 关闭wait遮罩
					if (result.success) {
						if(me.redirectUrl){
							window.location.href=me.redirectUrl;
							localStorage.removeItem('redirectUrl');
						}
						let user = result.data;
						// me.cookieService.putObject('studentInfo', user);                          // 用户信息存入cookie
						Object.assign(me.settings.user, user);                                        // 用户信息存入公共服务
						localStorage.setItem('userInfo',JSON.stringify(user));
						if (this.isBack == "back") me.location.back(); //返回上一页
						else me.router.navigate(['/manage/student'], {replaceUrl: true}); //去个人中心K
					}else {
						if(result.data.code==9006){
							AppComponent.rzhAlt('error',SettingsService.I18NINFO.swat.e120)
						}else if(result.data==11002){
							AppComponent.rzhAlt('error',SettingsService.I18NINFO.swat.e266)
						}else if(result.data==11003){
							AppComponent.rzhAlt('error',SettingsService.I18NINFO.swat.e267)
						}else{
							AppComponent.rzhAlt('error',SettingsService.I18NINFO.swat.e112,SettingsService.I18NINFO.swat.e120, 'error')
						}
					}
				},
				error: result => {
					swal(SettingsService.I18NINFO.swat.e112, SettingsService.I18NINFO.swat.e114, 'error');
				}
			});
		}
	};

	/**
	 * 学生注册
	 * @param formData     学生注册信息
	 */
	studentRegister(formData) {
		if (formData.valid) {
			const me = this;
			MaskService.showMask();
			formData.value.type = 'Personal';
			me.ajax.post({
				url: '/student/signup',
				data: formData.value,
				success: result => {
					MaskService.hideMask();                                                       // 关闭wait遮罩
					if (result.success) {
						// swal({                      // 注册成功弹窗提醒
						// 		title: SettingsService.I18NINFO.swat.e115,
						// 		text: SettingsService.I18NINFO.swat.e117,
						// 		type: "success",
						// 		showCancelButton: false,
						// 		confirmButtonColor: "#A5DC86",
						// 		confirmButtonText: SettingsService.I18NINFO.swat.e118,
						// 		closeOnConfirm: true
						// 	},
						// 	function () {              // 弹框确认跳转登录窗口
						// 		me.Register.reset();
						// 		me.studentTabs.tabs[0].active = true;
						// 	});
						AppComponent.rzhAlt("success", SettingsService.I18NINFO.swat.e115, SettingsService.I18NINFO.swat.e251);
						me.router.navigate(['/pages/login'], {replaceUrl: true});
						me.Register.reset();
						me.studentTabs.tabs[0].active = true;
					} else {
						if(result.data.code == 1000){
							AppComponent.rzhAlt("error", SettingsService.I18NINFO.swat.e116, SettingsService.I18NINFO.swat.e246);
						}else {
							AppComponent.rzhAlt("error", SettingsService.I18NINFO.swat.e116, SettingsService.I18NINFO.swat.e239);
						}
					}
				},
				error: result => {
					swal(SettingsService.I18NINFO.swat.e112, SettingsService.I18NINFO.swat.e114, 'error');
				}
			});
		}else{
			AppComponent.rzhAlt('info',SettingsService.I18NINFO.swat.noTotal);
		}
		;
	};
}
