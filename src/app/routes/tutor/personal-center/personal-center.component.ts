import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import {TutorService} from "../tutor.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {CookieService} from "angular2-cookie/core";
import {AppComponent} from "../../../app.component";

const swal = require('sweetalert');

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  public imgBase64: string;
  public tutorData: any;
  public tutorCode: string;
  public timezones: Array<any> = new Array(); //时区信息
  public countryCode: Array<any> = new Array(); //国家代码信息
  public sexList: Array<any> = new Array(); // 性别信息
  public sexCode: number = 1001; //性别编码

  constructor(public tutor: TutorService, public settings: SettingsService, public tools: RzhtoolsService, public cookies: CookieService) { }

  ngOnInit() {
    this.tutorCode = this.settings.user.tutorCode;
    this.tutorData = this.tutor.load(this.tutorCode);
    this.timezones = this.tools.getTimeZones();
    this.countryCode = this.tools.getCountryCode();
    this.sexList = this.tools.getEnumDataList(this.sexCode);
  }

  /**
   * 更改头像
   * @param data
   * @param img
   * @returns {boolean}
   */
  upload(data, img) {
    let file = data.files[0];
    let me = this;
    if (!/image\/\w+/.test(file.type)) {
      swal(SettingsService.I18NINFO.swat.e221);
      return false;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      img.src = this.result;
      me.imgBase64 = this.result;
    };
  }

  modifyInfo(fromData) {
    let me = this;
    if(fromData.valid){
      me.tutor.modifyStudent(me.tutorCode, fromData.value, () => {
        this.tutorData = this.tutor.load(this.tutorCode);
        // this.cookies.putObject('tutorInfo', me.tutorData);
        this.settings.user = me.tutorData;
        AppComponent.rzhAlt('success',SettingsService.I18NINFO.swat.e124)
      }, me.imgBase64);
    }
  }

}
