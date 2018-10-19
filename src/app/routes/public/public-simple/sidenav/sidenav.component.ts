import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
import {SettingsService} from "../../../../core/settings/settings.service";
import {Router} from "@angular/router";
const swat = require("sweetalert");

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
	@Input() slide: boolean;
	@Output() slideChange = new EventEmitter();
	isLogin: boolean; //是否登录
	userUrl: string; //个人中心
	userInfo: any; //用户信息
	// sidenavMenuList: Array<any> = SettingsService.sidenavMenuList;//侧边栏导航列表

	constructor(public tools: RzhtoolsService, public setting: SettingsService, public router: Router) {
	}

	ngOnInit() {
		let _this = this;
		_this.userInfo = _this.setting.user;
		_this.isLogin = RzhtoolsService.ckLogin();
		if (_this.isLogin) {
			if (_this.userInfo.tutorCode) _this.userUrl = "/manage/tutor"; else _this.userUrl = "/manage/student"
		}
	}

	/**
	 * 点击控制父组件的slide改变
	 */
	clickSlide() {
		this.slideChange.emit();
	}

	/**
	 * 选择菜单按钮
	 * @param menu 菜单信息
	 */
	selMenu(menu: any) {
		let _this = this;
		if (menu && !menu.isHttp) _this.tools.selMenu(menu.url); //顶部菜单选中
		_this.clickSlide(); //关闭侧边栏
	}

	/**
	 * 去个人中心页面
	 */
	goHome() {
		let _this = this;
		_this.router.navigate([_this.userUrl]); //跳转到相应页面
		_this.clickSlide(); //关闭侧弹框
	}

	/**
	 * 退出登录
	 */
	loginOut() {
		let _this = this, ret: boolean;
		ret = _this.tools.logOut(); //退出登录
		if (!ret) swat(SettingsService.I18NINFO.swat.e102);
		else {
			_this.isLogin = RzhtoolsService.ckLogin(); //再次检测登录信息
			_this.setting.user = {}; //重置用户信息
			_this.userInfo = _this.setting.user;
            window.location.href = "/";//返回首页
			// _this.clickSlide();//关闭侧弹框
		}
	}

}
