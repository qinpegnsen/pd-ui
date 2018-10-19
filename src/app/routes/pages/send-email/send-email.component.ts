import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {Router, ActivatedRoute} from "@angular/router";
import {AjaxService} from "../../../core/services/ajax.service";
import {CookieService} from "angular2-cookie/core";
import {PatternService} from "../../../core/forms/pattern.service";
import {MaskService} from "../../../core/services/mask.service";
import {AppComponent} from "../../../app.component";
import {isNullOrUndefined} from "util";

const swal = require('sweetalert');
@Component({
    selector: 'app-send-email',
    templateUrl: './send-email.component.html',
    styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {

    role: string;   //发送邮件的角色
    constructor(public settings: SettingsService, public cookieService: CookieService, public patterns: PatternService, public ajax: AjaxService, public router: Router, public tools: RzhtoolsService, public location: Location, public routeInfo: ActivatedRoute) {
    }

    ngOnInit() {
        this.role = this.routeInfo.snapshot.queryParams['role'];
    }


    /**
     * 发送邮件
     * @param formData
     */
    sendEmail(formData) {
        if (formData.valid) {
            const me = this;
            MaskService.showMask();
            let data = {}, url: string;
            data = {email: formData.value.email};
            if (this.role == 'stu') {
                url = '/student/sendEmailtoFindPassword'
            } else {
                url = '/tutor/sendEmailtoFindPassword';
            }
            me.ajax.get({
                url: url,
                data: data,
                success: (result) => {
                    MaskService.hideMask();                                                       // 关闭wait遮罩
                    if (result.success) {
                        AppComponent.rzhAlt("success", SettingsService.I18NINFO.swat.e101, SettingsService.I18NINFO.swat.e250);
                    } else {
                        if (!isNullOrUndefined(JSON.parse(result.info)['code'])) {
                            if (JSON.parse(result.info)['code'] == '8101') {
                                AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e252);//操作过于频繁
                            }else{
                                AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e104);//其他的错误
                            }
                        } else {
                            AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e104);//其他的错误
                        }
                    }
                },
                error: (result) => {
                    AppComponent.rzhAlt("error", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e114);
                }
            });

        } else {
            AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e103);
        }
        ;
    };
}

