import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SettingsService} from "../../../../core/settings/settings.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() slideChange = new EventEmitter();
  public home:string; //个人中心
  constructor(public setting:SettingsService) { }

  ngOnInit() {
    let _this = this,user =_this.setting.user;
    if(user.tutorCode) _this.home = "/manage/tutor"; //教师登录
    else if(user.studentCode) _this.home = "/manage/student"; //学生登录
  }

  /**
   * 点击控制父组件的slide值改变
   */
  clickSlide() {
    this.slideChange.emit();
  }

}
