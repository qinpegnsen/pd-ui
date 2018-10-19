import { Component, OnInit } from '@angular/core';
import {StudentService} from "../student.service";
import {SettingsService} from "../../../core/settings/settings.service";
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
  public studentData: any;
  public studentCode: string;
  public timezones: Array<any> = new Array();//时区信息
  public countryCode: Array<any> = new Array();//国家代码信息
  public sexList: Array<any> = new Array();// 性别信息
  public sexCode: number = 1001;//性别编码

  constructor(public student: StudentService, public settings: SettingsService, public tools: RzhtoolsService, public cookies: CookieService) { }

  ngOnInit() {
    this.studentCode = this.settings.user.studentCode;
    this.studentData = this.student.getDetail(this.studentCode);
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
  upload(data,img) {
    let file = data.files[0];
    let me = this;
    if (!/image\/\w+/.test(file.type)) {
      swal(SettingsService.I18NINFO.swat.e221);
      return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      img.src = this.result;
      me.imgBase64 = this.result;
    }
  }

  modifyInfo(fromData) {
    let me = this;
    me.student.modifyStudent(me.studentCode, fromData.value, () => {
      me.studentData = me.student.getDetail(me.studentCode);
      // this.cookies.putObject('studentInfo', me.studentData);
      this.settings.user = me.studentData;
      // swal(SettingsService.I18NINFO.swat.e123, SettingsService.I18NINFO.swat.e124, 'success');
      AppComponent.rzhAlt('success',SettingsService.I18NINFO.swat.e124);
    }, me.imgBase64);
  }

}
