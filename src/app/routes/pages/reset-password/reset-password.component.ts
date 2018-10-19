import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {MaskService} from "../../../core/services/mask.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {CookieService} from "angular2-cookie/core";
import {Router} from "@angular/router";
import {PatternService} from "../../../core/forms/pattern.service";
import {AjaxService} from "../../../core/services/ajax.service";
import {AppComponent} from "../../../app.component";
declare var $: any;
const swal = require('sweetalert');
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    code: string; //学生或者老师的编码
    role: string; //学生或者老师的角色
    constructor(public settings: SettingsService, public cookieService: CookieService, public patterns: PatternService, public ajax: AjaxService, public router: Router, public tools: RzhtoolsService, public location: Location) {
    }

    ngOnInit() {
        this.checkVaild();
    }

    /**
     * 检查链接内容的合法性
     */
    checkVaild() {
        let me = this, Signatur: string;
        let arr = me.location.path().split("/");
        Signatur = arr[3];
        me.code = arr[4];
        me.role = arr[5];
        let data = {
            digitalSignature: Signatur,
            code: me.code,
        }, url: string;
        if (me.role == 'student') {
            url = '/student/checkLinktoFindPassword';
        } else {
            url = '/tutor/checkLinktoFindPassword';
        }
        me.ajax.get({
            url: url,
            data: data,
            success: (result) => {
                MaskService.hideMask();                                                       // 关闭wait遮罩
                if (result.success) {

                } else {
                    AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e248);
                    this.router.navigate(['/pages/login'], {replaceUrl: true});
                }
            },
            error: (result) => {
                AppComponent.rzhAlt("error", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e114);
            }
        });
    }

    /**
     * 重置密码
     * 1.首先判断密码是否有效 （6-16）位
     * 2.判断密码是否输入的一致
     * @param formData
     */
    resetPass(formData) {
        if (formData.valid) {
            const me = this;
            if (formData.value.newPass === formData.value.confirmPass) { //确认密码是否匹配
                MaskService.showMask();
                let data: any, url: string;
                if (me.role == 'student') {
                    url = '/student/resetStudentPassword';
                    data = {newPassword: formData.value.confirmPass, studentCode: me.code};
                } else {
                    url = '/tutor/resetTutorPassword';
                    data = {newPassword: formData.value.confirmPass, tutorCode: me.code};
                }
                me.ajax.get({
                    url: url,
                    data: data,
                    success: (result) => {
                        MaskService.hideMask();                                                       // 关闭wait遮罩
                        if (result.success) {
                            AppComponent.rzhAlt("success", SettingsService.I18NINFO.swat.e101, SettingsService.I18NINFO.swat.e240);
                            if(me.role == 'student'){
                                this.router.navigate(['/pages/login'], {replaceUrl: true});
                            }else{
                                this.router.navigate(['/pages/tutorLogin'], {replaceUrl: true});
                            }
                        } else {
                            AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e125);
                        }
                    },
                    error: (result) => {
                        AppComponent.rzhAlt("error", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e114);
                    }
                });
            } else {
                AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e247);
            }
        }
        ;
    };
}
