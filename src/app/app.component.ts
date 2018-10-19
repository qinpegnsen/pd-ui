import {Component, OnInit} from "@angular/core";
import {Location} from '@angular/common';
import {CookieService} from "angular2-cookie/core";
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SettingsService} from "./core/settings/settings.service";
import {RzhtoolsService} from "./core/services/rzhtools.service";
import {isNullOrUndefined} from "util";
import {ToasterConfig, ToasterService} from "angular2-toaster";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    public toaster: ToasterConfig = new ToasterConfig({
        showCloseButton: true,
        tapToDismiss: false,
        timeout: {'success': 5000, 'warning': 5000, 'error': 5000,'info': 5000},
        positionClass: 'toast-top-center',
        animationClass: 'slide-from-top'
    });
    static toasterService:ToasterService; //消息提示服务
    redirectUrl:string;  //学生如果是从官网跳转过来的话会有这个查询参数

    constructor(public location: Location, public cookieService: CookieService, public router: Router, public settings: SettingsService, public tools: RzhtoolsService, public translate: TranslateService,public toasterService:ToasterService) {
        //获取国际化信息
        let languageList: Array<string> = new Array();
        SettingsService.language.forEach(ret => {
            languageList.push(ret.key);
        });
        translate.addLangs(languageList);
        let browserLang = translate.getBrowserLang();
        let i18nInfo = cookieService.get(SettingsService.i18nSelLanguage); //獲取cookie中記錄的國際化信息
        if (i18nInfo) translate.use(i18nInfo);
        else translate.use(browserLang.match(/en|zh|zh-tw/) ? browserLang : 'en');
        tools.getI18nInfos(i18nInfo); //获取国际化信息
        AppComponent.toasterService = toasterService;
    }

    ngOnInit() {
        this.checkLogin(); //检测是否登录
    }

    /**
     * 检测是否登录，首先检测是否在 非检测 列表中，若不在，则进行检测，若在，则放过检测
     */
    public checkLogin() {
        const url = this.location.path();
        let redirectUrlIndex=url.indexOf('=')+1;
        if(redirectUrlIndex){
            this.redirectUrl=url.substr(redirectUrlIndex);
            localStorage.setItem('redirectUrl',this.redirectUrl);
        }
        // let loginCookie = this.cookieService.getObject('tutorInfo') || this.cookieService.getObject('studentInfo'), // 获取用户信息
        let sessionId = this.cookieService.get(SettingsService.sessionId);  // 获取登陆状态
        if (sessionId) {                //这个处理的是ajax
            let userType = this.cookieService.get('Tutor');
            let user;
            if (userType) {
                user = this.tools.getTutor();
            } else {
                user = this.tools.getStudent();
            }
            Object.assign(this.settings.user, user);
        }
        if (!RzhtoolsService.checkLoginIntercept(url) && url) { //检测是否在 非检测 列表中，若不在，则检测           //这个处理的是用户输入浏览器地址的跳转
            if (url !== '/pages/login' && !sessionId && !(new RegExp('/pages/resetPass').test(url)) && url !== '/pages/send') {
                this.router.navigate(['/pages/login'], {replaceUrl: true});
            } // 路由跳转
            if (url == '/pages/login' && sessionId) {
                this.router.navigate(['/goods'], {replaceUrl: true});
            } // 路由跳转
        }
        // if (loginCookie) Object.assign(this.settings.user, loginCookie);
        this.tools.selMenu(url); //菜单选中
    }

    /**
     * 消息提醒弹框
     * @param type 类型：error、success、info...
     * @param title 提示头信息
     * @param info 内容信息
     * @param operation 参数信息
     */
    static rzhAlt (type: string, title: string, info?: string, operation?: any,appcom?:AppComponent) {
        if (!isNullOrUndefined(operation)) appcom.toaster = new ToasterConfig(operation);
        AppComponent.toasterService.pop(type, title, info);
    }

}