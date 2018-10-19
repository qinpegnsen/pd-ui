import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SettingsService} from "../../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
import {Router} from "@angular/router";
declare var $: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	@Output() slideChange = new EventEmitter();
	// menuList: Array<any> = SettingsService.menu; //菜单信息
	public isLogin: boolean;
	public homeIndex: string; //个人中心首页

	constructor(public tools: RzhtoolsService, public router: Router, public settings: SettingsService) {
	}

	ngOnInit() {
		let _this = this;
		_this.isLogin = RzhtoolsService.ckLogin(); //检查是否登录
		_this.settings.menuList=[ //顶部导航
			{sel: true, url: "/goods", name: SettingsService.I18NINFO.menu.goods},
			{sel: false, url: "/search", name: SettingsService.I18NINFO.menu.order}
		];
		if(!_this.isLogin ){          //如果没有登录的话不让用户看到老师的信息
			_this.settings.menuList.pop()
		}
	}

	/**
	 * 跳转目标地址
	 * @param event
	 */
	go(url) {
		this.tools.selMenu(url);
	}

	/**
	 * 点击控制父组件的slide值改变
	 */
	clickSlide() {
		this.slideChange.emit();
	}


	/**
	 * 去往个人中心页面
	 */
	goHome() {
		let _this = this, studentOrTutor = _this.tools.ckStudentOrTutor();
		if (studentOrTutor == SettingsService.tutorLogin) _this.homeIndex = SettingsService.tutorIndex;
		else if (studentOrTutor == SettingsService.studentLogin) _this.homeIndex = SettingsService.studentIndex;
		else _this.homeIndex = "/";
		_this.router.navigate([_this.homeIndex]);
	}
}
