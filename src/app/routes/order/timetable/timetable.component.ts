import {Component, OnInit} from "@angular/core";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {isNullOrUndefined} from "util";
import {ActivatedRoute, Router} from "@angular/router";
import {Datas, OrderService, Times} from "../order.service";
import {TutorService} from "../../tutor/tutor.service";
import {SettingsService} from "../../../core/settings/settings.service";
declare var $: any;
const swat = require("sweetalert");

@Component({
	selector: 'app-timetable',
	templateUrl: './timetable.component.html',
	styleUrls: ['./timetable.component.css']
})

export class TimetableComponent implements OnInit {
	dates: Array<string> = new Array(); // 日期信息
	dateInfo: Boolean = true; // 日期提示语
	timeZones: Array<any>; // 时区集合
	timetableData: Array<Datas> = []; //课表数据源
	tutorCode: string; //教师编码
	tutor: any; //教师信息
	student:any; //学员信息
	selTimeZone:string; //选择的时区(默认当前用户的时区)

	constructor(public routeInfo: ActivatedRoute,public router:Router, public tools: RzhtoolsService, public orderService: OrderService, public tutorService: TutorService,public settings:SettingsService) {
	}

	ngOnInit() {
		let _this = this;
		_this.orderService.loadSetting('Advance_Book_Time');
		_this.timeZones = _this.tools.getTimeZones(); //获取时区信息
		//获取路由的参数，设置教师编码
		let code = _this.routeInfo.snapshot.queryParams['code']; //获取类型code
		_this.student = _this.settings.user; //获取当前登录用户的信息
		if(_this.student && _this.student.timeZone) _this.selTimeZone = _this.student.timeZone;
		if(!isNullOrUndefined(_this.student.timeZone)){
			let firstDate = _this.tools.getAroundDateByDatemoment(_this.tools.localTimeTimeZone(_this.selTimeZone), 0);
			_this.timetableData = _this.orderService.timetableDefaultInfos(firstDate);//铺设课表信息
			if (!isNullOrUndefined(code)) {
				_this.orderService.tutor = _this.tutor = _this.tutorService.load(code);
				localStorage.setItem('tutor',JSON.stringify(_this.tutor));
				_this.tutorCode = code; //设置教师编码
				_this.drawTimeTable(); //绘制课表
			}
		}

	}

	/**
	 * 选择日期，封装日期信息
	 * @param e 节点
	 */
	selDate(e) {
		let t = e.target, val = t.value, checked = t.checked, _this = this;
		if (checked) {
			_this.dates.push(val);
		} else {
			var index = _this.dates.indexOf(val, 0);
			if (index > -1) _this.dates.splice(index, 1);
		}
		if (_this.dates.length < 1) _this.dateInfo = false; else _this.dateInfo = true;
	}

	/**
	 * 下7天课表
	 */
	nextTimeTable() {
		let _this = this, num = _this.timetableData.length-1; //获取最后一个对象的下标
		_this.dates = []; //清空日期列表
		_this.timetableData = _this.orderService.timetableDefaultInfos(_this.tools.getAroundDateByDate(new Date(_this.timetableData[num].date), 1));
		_this.drawTimeTable(); //绘制课表
	}

	/**
	 * 上7天课表
	 */
	prevTimeTable() {
		let _this = this, num = 0 - (_this.timetableData.length); //获取上一周的第一天
		_this.dates = []; //清空日期列表
		let date = _this.tools.getAroundDateByDate(new Date(_this.timetableData[0].date), num); //获取上一周的第一天
		if (_this.tools.dateToUnix(_this.tools.dataFormat(date,'yyyy-MM-dd')) < _this.tools.dateToUnix( _this.tools.localTimeTimeZone(_this.selTimeZone).format('YYYY-MM-DD'))) return; //课表时间小于当前时间时，不予刷新
		_this.timetableData = _this.orderService.timetableDefaultInfos(date); //设置课表信息
		_this.drawTimeTable(); //绘制课表
	}

	/**
	 * 切换时区时，自动转换课表
	 */
	timetableForTimeZone(){
		let _this = this;
		let firstDate = _this.tools.getAroundDateByDatemoment(_this.tools.localTimeTimeZone(_this.selTimeZone),0);
		_this.timetableData = _this.orderService.timetableDefaultInfos(firstDate);//铺设课表信息
		_this.drawTimeTable(); //绘制课表
	}

	/**
	 * 绘制课表
	 */
	public drawTimeTable() {
		let _this = this,
			courseData = _this.orderService.queryTimeTable(_this.tutorCode,_this.selTimeZone, _this.timetableData[0].date, _this.timetableData[_this.timetableData.length - 1].date);
		_this.timetableData = _this.orderService.setTimetableSel(courseData, this.timetableData,_this.selTimeZone); //设置可选择课表信息
	}

	/**
	 * 选中待预约的课程
	 * @param times
	 */
	selTimetable(times: Times) {
		let _this = this;
		_this.orderService.selTimetable(times, _this.timetableData);
	}

	/**
	 * 提交课表选择信息
	 */
	onSubmit() {
		let _this = this, selList: Array<Times>;
		let isLogin:boolean = RzhtoolsService.checkLogin(true); //检测登录
		if(isLogin){
			selList = _this.orderService.selTimeTableInfo(_this.timetableData); //获取已选择的课程对象集合
			if (selList.length > 0) {
				_this.orderService.selTimetableInfo = selList;
				localStorage.setItem('timetableInfo',JSON.stringify(selList));
				_this.router.navigate(["/order/confirm"]);  //去确认页面
			}else{
				swat(SettingsService.I18NINFO.swat.e210);
			}
		}else{
			swat(SettingsService.I18NINFO.swat.e110);
		}
	}

}
