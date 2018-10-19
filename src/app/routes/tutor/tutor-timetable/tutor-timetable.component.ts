import { Component, OnInit } from '@angular/core';
import {Datas, OrderService, Times} from "../../order/order.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {TutorService} from "../tutor.service";
import {isNullOrUndefined} from "util";
import {Router} from '@angular/router';
import {SettingsService} from "../../../core/settings/settings.service";


@Component({
  selector: 'app-tutor-timetable',
  templateUrl: './tutor-timetable.component.html',
  styleUrls: ['./tutor-timetable.component.css']
})
export class TutorTimetableComponent implements OnInit {

	dates: Array<string> = new Array(); // 日期信息
	dateInfo: Boolean = true; // 日期提示语
	timetableData: Array<Datas> = []; //课表数据源
	tutorCode: string; //教师编码
	tutor: any; //教师信息
	courses: Array<any> = new Array();
	tutorTimeZone: string; //教师的时区

  constructor(public settings: SettingsService,public router:Router, public tools: RzhtoolsService, public orderService: OrderService, public tutorService: TutorService) { }

  ngOnInit() {
	  let _this = this;
	  _this.tutorTimeZone = _this.settings.user.timeZone;
	  let firstDate = _this.tools.getAroundDateByDatemoment(_this.tools.localTimeTimeZone(_this.tutorTimeZone), 0);
	  _this.timetableData = _this.orderService.timetableDefaultInfos(firstDate);//铺设课表信息
	  //获取路由的参数，设置教师编码
	  let code = _this.settings.user.tutorCode; //获取类型code
	  if (!isNullOrUndefined(code)) {
		  _this.orderService.tutor = _this.tutor = _this.tutorService.load(code);
		  _this.tutorCode = code; //设置教师编码
		  _this.drawTimeTable(); //绘制课表
	  }
	  this.courses = this.tutorService.loadDetail(this.tutorCode).tutorCourses;
  }

	/**
	 * 下7天课表
	 */
	nextTimeTable() {
		let _this = this, num = _this.timetableData.length - 1; //获取最后一个对象的下标
		_this.dates = []; //清空日期列表
		_this.timetableData = _this.orderService.timetableDefaultInfos(_this.tools.getAroundDateByDate(new Date(_this.timetableData[num].date), 1));
		_this.drawTimeTable(); //绘制课表
	}

	/**
	 * 上7天课表
	 */
	prevTimeTable() {
		let _this = this, num = 0 - (_this.timetableData.length); //获取向前的天数
		_this.dates = []; //清空日期列表
		let date = _this.tools.getAroundDateByDate(new Date(_this.timetableData[0].date), num); //课表向前翻动，前一个课表的第一天的日期
		if (_this.tools.dateToUnix(_this.tools.dataFormat(date,'yyyy-MM-dd')) < _this.tools.dateToUnix( _this.tools.localTimeTimeZone(_this.tutorTimeZone).format('YYYY-MM-DD'))) return; //课表时间小于当前时间时，不予刷新
		_this.timetableData = _this.orderService.timetableDefaultInfos(date); //设置课表信息
		_this.drawTimeTable(); //绘制课表
	}

	/**
	 * 绘制课表
	 */
	public drawTimeTable() {
		let _this = this,
			courseData = _this.orderService.queryTimeTable(_this.tutorCode,_this.tutor.timeZone, _this.timetableData[0].date, _this.timetableData[_this.timetableData.length - 1].date);
		_this.timetableData = _this.orderService.setTimetableSel(courseData, _this.timetableData,_this.tutorTimeZone); //设置可选择课表信息
	}

}
