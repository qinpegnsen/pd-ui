import {Injectable} from "@angular/core";
import {AjaxService} from "../../core/services/ajax.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {SettingsService} from "../../core/settings/settings.service";
import * as momentDate from 'moment';
import {AppComponent} from "../../app.component";
@Injectable()
export class OrderService {
	tutor: any; //教师信息
	selTimetableInfo: Array<Times>; //所选课表信息
	leaveMsg: string; //预约留言
	advanceTime:any; //允许提前预约的时间，（例如 3可以预约3小时后的课程）
	constructor(public ajax: AjaxService, public tools: RzhtoolsService, public setting: SettingsService) {
	}

	/**
	 * 查询一个老师的课表信息
	 * @param tutorCode 教师编码
	 * @param timeZone 时区
	 * @param sDate 开始日期
	 * @param Edate 结束日期
	 */
	queryTimeTable(tutorCode: string,timeZone:string, sDate: string, Edate: string) {
		let _this = this, datas: Array<any> = new Array();
		//转换时区
		if(timeZone){
			sDate = _this.tools.timeZoneDateToUTC(sDate + " 00:00:00", timeZone); //转换时区
			Edate = _this.tools.timeZoneDateToUTC(Edate + " 23:59:59", timeZone); //转换时区
		}else{
			sDate = _this.tools.dateToUTC(sDate + " 00:00:00"); //转换时区
			Edate = _this.tools.dateToUTC(Edate + " 23:59:59"); //转换时区
		}
		_this.ajax.get({
			url: '/timetable/tutor/timetables',
			data: {
				tutorCode: tutorCode,
				pageSize: "200", //分页长度，一页出来完
				startDate: sDate,
				endDate: Edate
			},
			mask: true,
			async: false,
			success: function (res) {
				if (res.success) datas = res.data.voList;
				else console.log("数据加载失败！");
			}
		});

		//转换时区
		if(timeZone){
			datas.forEach(ret => {
				ret.courseTime = _this.tools.UTCToTimeZoneDate(ret.courseTime, timeZone); //转换时区
			});
		}else{
			datas.forEach(ret => {
				ret.courseTime = _this.tools.UTCToDate(ret.courseTime); //转换时区
			});
		}
		return datas;
	}

	/**
	 * 铺设课表信息
	 */
	timetableDefaultInfos(date: Date) {
		let _this = this, newDate: Date, dates: Datas, datesDate: string, datesWeek: string,
			times: Times, timetableData: Array<Datas> = [];
		for (let i = 0; i < 7; i++) { //未来七天信息设置
			dates = new Datas(); //实例化日期
			newDate = _this.tools.getAroundDateByDate(date, i); //获取日期
			datesDate = _this.tools.dataFormat(newDate, "yyyy-MM-dd"); //格式化日期
			datesWeek = _this.tools.getWeek(newDate); //获取周几
			dates.date = datesDate; //设置日期
			dates.week = datesWeek; //设置星期几
			timetableData.push(dates) //设置信息集合
		}
		return timetableData;
	}

	/**
	 * 设置装载信息，并标示出可选课表
	 * @param datas 可选课表源
	 * @param timetableData 铺设信息源
	 * @param selTimeZone 当前选择的时区    在老师那也掉这个了，不用这个时区的信息
	 * @returns {Array<Datas>}
	 */
	setTimetableSel(datas: Array<any>, timetableData: Array<Datas>,selTimeZone?) {
		let _this = this, datasInfo, ttdInfo: Datas, timeInfo: Times, info;
		for (let a = 0; a < timetableData.length; a++) {
			ttdInfo = timetableData[a];
			ttdInfo.times = new Array(); //初始化
			for (let b = 0; b < datas.length; b++) {
				info = datas[b];
				datasInfo= momentDate(info.courseTime).format('YYYY-MM-DD HH:mm:ss');   //解决ie的兼容性问题，所以用这个方法
				if (ttdInfo.date == datasInfo.substr(0, 10)) {
					timeInfo = new Times();
					timeInfo.courseTime = _this.tools.dateToUnix(info.courseTime); //课程开始时间
					timeInfo.courseEndTime = timeInfo.courseTime + info.duration * 60 * 1000; //课程结束时间
					timeInfo.timetableCode = info.timetableCode; //课程编码
					timeInfo.courseHourType = info.courseHourType; //类型
					timeInfo.courseHour = info.courseHour; //类型
					timeInfo.course = info.course;
					timeInfo.amAndPm = info.amAndPm; //上午或下午
					timeInfo.state = info.state; //状态
					if (timeInfo.state == 'Unavailable') timeInfo.disabled = false; //是否可选
					else timeInfo.disabled = true;


					/**
					 * 设置学生可以预约几小时外的课程
					 */
					let nowDate=_this.tools.localTimeTimeZone(selTimeZone);
					let nowDateTime=nowDate.format('YYYY-MM-DD HH:mm:ss');
					// let selDate=Number(nowDate.valueOf())+_this.advanceTime*60*60*1000;       //不能用valueOf()  因为是moment的方法，不识别时区，如果有时区的话，就会默认是当前时间
					let selDate=Number(_this.tools.dateToUnix(nowDateTime))+_this.advanceTime*60*60*1000;
					if(selDate>Number(timeInfo.courseTime)){
						timeInfo.overTime=true;
					}
					ttdInfo.times.push(timeInfo);
				}
			}
			ttdInfo.times.sort((a,b) => {return a.courseTime - b.courseTime});
		}
		return timetableData;
	}


	/**
	 * 获取已选课程的对象集合
	 * @param timetableData 课表集合
	 * @returns {Array<Times>}
	 */
	selTimeTableInfo(timetableData: Array<Datas>) {
		let timeList: Array<Times> = [], date: Datas, time: Times;
		for (let i = 0; i < timetableData.length; i++) {
			date = timetableData[i];
			for (let j = 0; j < date.times.length; j++) {
				time = date.times[j];
				if (time.sel) timeList.push(time);
			}
		}
		return timeList;
	}

	/**
	 * 生成课表添加的信息
	 * @param dates
	 * @param infos
	 */
	buildTimeTableInfo(dates: Array<string>, infos: any) {
		let ren: Array<TimeTable> = new Array(), timeTable: TimeTable, _this = this, time: Date;
		for (let date of dates) {
			timeTable = new TimeTable(), time = new Date(date + " " + infos.stime);
			timeTable.tutorCode = infos.tutorCode; //教师编码
			timeTable.courseCode = infos.courseCode; //课程编码
			timeTable.course = infos.courseName; //课程名
			timeTable.courseTimeString = _this.tools.dataFormat(time, "yyyy-MM-dd HH:mm:ss"); // 上课时间
			timeTable.week = _this.tools.getWeek(time); //获取周几
			timeTable.amAndPm = _this.tools.dataFormat(time, "HH") < 12 ? "AM" : "PM";
			timeTable.duration = infos.duration; //课程时长
			timeTable.num = infos.num; //学员上限
			timeTable.courseHour = infos.courseHour; //所需课时
			timeTable.courseHourType = infos.courseHourType; //课时类型
			timeTable.state = infos.state; //课表状态
			timeTable.tuTimeZone = infos.zones; //时区信息
			ren.push(timeTable);
		}
		return ren;
	}

	/**
	 * 设置课表选择为单选
	 * @param times
	 * @param timetableData
	 * @returns {Array<any>}
	 */
	selTimetable(times: Times, timetableData: Array<any>) {
		times.sel = !times.sel;
		timetableData.forEach((dataVal: Datas, idx, array) => {
			dataVal.times.forEach((val: Times, idx, array) => {
				if (val.timetableCode == times.timetableCode) val = times;
				else val.sel = false;
			})
		})
		return timetableData;
	}

	/**
	 * 封装设置需提交的课表信息
	 * @param selInfo 用户所选的课表信息
	 * @param leaveMsg 预约留言
	 * @returns {OrderInfo}
	 */
	setOrderInfo(selInfo: Times, leaveMsg: string) {
		let _this = this, orderInfo: OrderInfo = new OrderInfo(), user = _this.setting.user;
		orderInfo.studentName = user.name; //用户名
		orderInfo.studentCode = user.studentCode; //用户编码
		orderInfo.studentEmail = user.email; //用户email
		orderInfo.timetableCode = selInfo.timetableCode; //所选择的课程编码
		orderInfo.courseHourType = selInfo.courseHourType; //课时类型
		orderInfo.leaveMsg = leaveMsg; //预约留言
		return orderInfo;
	}

	/**
	 * 创建预约
	 * @param orderInfo 提交信息
	 * @returns {any}
	 */
	classroomBook(orderInfo: OrderInfo) {
		let ret: any;
		this.ajax.post({
			url: "/classroom/book",
			data: orderInfo,
			mask: true, //锁屏
			async: false, //同步
			success: (response) => {
				ret = response;
			},
			error: (response) => {
				console.log(response.data);
			}
		})
		return ret;
	}

	/**
	 * 加载一个系统参数
	 * @param key                        参数键值
	 * @returns {any}                    参数值
	 */
	loadSetting(key) {
		let result: any = '';
		const me = this;
		me.ajax.get({
			url: '/setting/loadset',
			data: {k: key},
			async: false,
			success: res => {
				res.success ? me.advanceTime = Number(res.data) : AppComponent.rzhAlt('error', '', SettingsService.I18NINFO.swat.e141);
			},
			error: res => {
				console.log(res);
			}
		});
	};

	/**
	 * 取消预约信息
	 * @param studentCode 学员code
	 * @param classroomCode 预约编码
	 * @returns {any}
	 */
	cancelOrder(studentCode: string, classroomCode: string) {
		let _this = this,ret: any;
		_this.ajax.put({
			url: "/classroom/cancel",
			data: {studentCode: studentCode, classroomCode: classroomCode},
			mask: true, //锁屏
			async: false, //同步
			success: (response) => {
				ret = response;
			}
		})
		return ret;
	}

}

/**
 * 日期对象
 */
export class Datas {
	date: string; //日期
	week: string; //周几
	times: Array<Times> = [] //时间集合
}

/**
 * 时间对象
 */
export class Times {
	timetableCode: string; //课表code
	studentCode: string; //用户编码
	studentName: string; //用户姓名
	studentEmail?: string; //用户email
	courseHourType: string; //消耗课时类型
	courseHour: number; //消耗课时类型
	course?: string; //课程名
	leaveMsg?: string; //留言信息
	courseTime: any; //时间
	courseEndTime: number; //时间
	sel?: boolean = false; //是否选中
	amAndPm?: string; //上午 或 下午
	state?: string; //状态
	disabled?: boolean;//是否可选
	overTime?: boolean=false;//当天预约的时候是否超过预定3小时的时间
}

/**
 * 课表对象
 */
export class TimeTable {
	tutorCode: string; //老师编码
	courseCode: string; //课程编码
	course: string; //课程
	courseTimeString: string; //上课时间
	week: string; //星期几
	duration: string; //时长
	amAndPm: string; //上午或下午
	num: string; //预约上限
	advanceTimeString?: string; //提前预约时间
	courseHour: string; //所需课时
	courseHourType: string; //课时类型
	state: string; //状态
	tuTimeZone: string; //时区
}

/**
 * 预约信息
 */
export class OrderInfo {
	studentCode: string; //学员编码
	studentName: string; //学生姓名
	studentEmail?: string; //学生邮箱
	timetableCode: string; //课表编码
	courseHourType: string; //课时类型
	leaveMsg?: string; //预约留言
}
