import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Location} from '@angular/common';
import {Router, NavigationEnd} from '@angular/router'
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    public tutorCode: string;
    public isLogin: boolean;

    @Output() slideChange = new EventEmitter();

    constructor(public location: Location, public router: Router, public settings: SettingsService, public tools: RzhtoolsService) {
    }

    ngOnInit() {
    }

    /**
     * 点击控制父组件的slide值改变
     */
    clickSlide() {
        this.slideChange.emit();
    }

    /**
     * 选择菜单按钮
     * @param menu 菜单信息
     */
    selMenu(menu: any) {
        this.isLogin = RzhtoolsService.ckLogin(); //检查是否登录
        if (this.isLogin) {          //如果没有登录的话不让用户看到老师的信息
            this.settings.menuList=[
                {sel: true, url: "/goods", name: SettingsService.I18NINFO.menu.goods},
                {sel: false, url: "/search", name: SettingsService.I18NINFO.menu.order}
            ]
        }
        this.tools.selMenu(menu); //顶部菜单选中
    }

    /**
     * 去‘设置’页面
     */
    goInfo() {
        let _this = this, loginUser: string = _this.tools.ckStudentOrTutor(), link: string = "manage/student/info";
        if (loginUser == SettingsService.tutorLogin) link = "manage/tutor/info";
        _this.router.navigate([link]);
    }
}
