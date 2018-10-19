import {Component, OnInit, EventEmitter, Input, Output, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {NavigationEnd, Router} from '@angular/router';
const swat = require("sweetalert");

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
    @Input() slide: boolean;
    @Output() slideChange = new EventEmitter();
    sidenavMenuList: Array<any> = new Array()  //侧边栏导航列表
    // cancelSubscribe: any;   //组件销毁的时候进行取消
    constructor(public settings: SettingsService, public tools: RzhtoolsService, public router: Router, public location: Location) {
    }

    ngOnInit() {
        if (this.location.path().indexOf('/manage/tutor') != -1) {
            this.sidenavMenuList = [     //通过服务来写 有时候刷会丢掉数据，加延时也不行
                {
                    isHttp: false,  //通过这个属性来确定是否跳转到外部网站
                    name: SettingsService.I18NINFO.tutorMenu.home,
                    url: '/manage/tutor',
                    icon: "fa fa-user"
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.tutorMenu.teachingRecord,
                    url: '/manage/tutor/record',
                    icon: 'fa fa-book'
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.tutorMenu.order,
                    url: '/manage/tutor/order',
                    icon: 'fa fa-tty'
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.tutorMenu.timetable,
                    url: '/manage/tutor/timetable',
                    icon: 'fa fa-calendar'
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.tutorMenu.setTimetable,
                    url: '/manage/tutor/set',
                    icon: 'fa fa-edit'
                }
                // ,
                // {
                // 	isHttp: false,
                // 	name: SettingsService.I18NINFO.tutorMenu.setUp,
                // 	url: '/manage/tutor/info',
                // 	icon: 'fa fa-gear'
                // }
            ];

        } else {
            this.sidenavMenuList = [
                {
                    isHttp: true,
                    name: 'Pondlets',
                    url: 'https://chinese.ponddy.com/learner/dashboard/',
                    icon: "fa fa-puzzle-piece"
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.studentMenu.home,
                    url: '/manage/student',
                    icon: "fa fa-user"
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.studentMenu.classHour,
                    url: '/manage/student/center',
                    icon: 'fa fa-table'
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.studentMenu.order,
                    url: '/manage/student/order',
                    icon: "fa fa-tty"
                },
                {
                    isHttp: false,
                    name: SettingsService.I18NINFO.studentMenu.collection,
                    url: '/manage/student/collection',
                    icon: "fa fa-users"
                }
                // ,
                // {
                // 	isHttp: false,
                // 	name: SettingsService.I18NINFO.studentMenu.setUp,
                // 	url: '/manage/student/info',
                // 	icon: "fa fa-gear"
                // }
            ];
        }
        // this.routerCheck();
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
        this.tools.selMenu(menu); //顶部菜单选中
    }

    /**
     * 退出登录
     */
    loginOut() {
        let _this = this, ret: boolean;
        ret = _this.tools.logOut(); //退出登录
        if (!ret) swat(SettingsService.I18NINFO.swat.e102);
        else {
            _this.settings.user = {}; //重置用户信息
            _this.router.navigate(["/"]); //返回首页
        }
    }

    // routerCheck() {
    //     this.cancelSubscribe = this.router.events.subscribe(events => {
    //         if (events instanceof NavigationEnd) {
    //             if (events.url.indexOf('/manage/tutor') != -1) {
    //                 this.sidenavMenuList = this.settings.tutorMenuList;
    //             } else {
    //                 this.sidenavMenuList = this.settings.studentMenuList;
    //             }
    //         }
    //     })
    // }
    //
    // ngOnDestroy() {
    //     this.cancelSubscribe.unsubscribe();
    // }
}
