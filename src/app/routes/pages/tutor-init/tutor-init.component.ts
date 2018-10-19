import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {Router, ActivatedRoute} from "@angular/router";

const swal = require('sweetalert')

@Component({
  selector: 'app-tutor-init',
  templateUrl: './tutor-init.component.html',
  styleUrls: ['./tutor-init.component.css']
})
export class TutorInitComponent implements OnInit {
  public isInit: boolean;
  public isFirstLogin:boolean;

  constructor(public ajax: AjaxService, public settings: SettingsService, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    let _this = this,state = _this.settings.user.state;
    _this.isInit = Boolean(_this.route.snapshot.queryParams['isInit']);
    if(state && state==SettingsService.reg) _this.isFirstLogin = true;
  }

  /**
   * 修改密码
   * @param data
   */
  tutorMidofy(data) {
    let me = this;
    me.ajax.put({
      url: '/tutor/modify/password',
      data: {
        tutorCode: me.settings.user.tutorCode,
        password: data.value.password,
        oldPassword: data.value.oldPassword
      },
      success: res => {
        if(res.success) {
          swal({
            title: SettingsService.I18NINFO.swat.e240,
            text: me.isInit ? SettingsService.I18NINFO.swat.e242 : '',
            type: "success",
            timer: 5000,
            showConfirmButton: false
          });
          setTimeout(() => {
            me.router.navigate(['/manage/tutor/info'], {replaceUrl: true});
          },5000);
        }else {
          swal(SettingsService.I18NINFO.swat.e241, res.info, "error");
        }
      },
      error: res => {
        console.log(res);
      }
    })
  }

}
