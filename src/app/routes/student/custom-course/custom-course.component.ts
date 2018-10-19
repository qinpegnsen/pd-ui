import {Component, OnInit} from '@angular/core';
import {SearchService} from "../../search/search.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {SettingsService} from "../../../core/settings/settings.service";
import {Page} from "../../../core/page/page";
import {Router} from "@angular/router";
import {StudentService} from "../student.service";
import {isNullOrUndefined} from "util";
const swat = require("sweetalert");

@Component({
	selector: 'app-custom-course',
	templateUrl: './custom-course.component.html',
	styleUrls: ['./custom-course.component.css']
})
export class CustomCourseComponent implements OnInit {
	coursesList: Array<any> = new Array(); //课程列表
	timeZoneList: Array<any> = new Array(); //时区列表
	courseCode: string; //选中的课程编码
	selDate: any; //所选日期
	bsConfig: Partial<BsDatepickerConfig>; //日期插件参数
	timeList: Array<any> = SettingsService.timeList; //时间列表
	selStartTime: string; //起始时间
	tutorList: Array<any> = new Array(); //老师集合
	page: Page; //分页信息
	curPage: number = 1; //当前页
	pageSize: number = 25; //每页条数
	addTutorNum: number = 0; //添加的老师的个数
	selectTutorList: Array<any>; //已选择的老师列表
	showSelect: boolean = false; //显示已选择老师列表
	leaveMsg: string; //留言信息
	selectCourseTypeInfo: string = null; //选中的课程类型名
	showSelectType: boolean; //显示、隐藏课程类型选择
	coursesTypeList: Array<any> = new Array(); //课程体系列表
	alreadySelectCourse: Array<any> = new Array(); //已选课程列表
	courseBySelect: string; //选择的课程编码
	isShowCourseType: boolean = true; //显示、隐藏课程类型选择框
	sel: any = {//查询参数
		curPage: this.curPage,
		pageSize: this.pageSize,
		courseCode: "",
		startDate: "",
		endDate: "",
		timeZone: ""
	};

	constructor(public search: SearchService, public tools: RzhtoolsService, public router: Router, public student: StudentService, public setting: SettingsService) {
	}

	ngOnInit() {
		let _this = this, startTime = SettingsService.alreadySelectStartTime,
			timeZone = SettingsService.alreadySelectTimeZone;
		_this.alreadySelectCourse = SettingsService.alreadySelectCourse; //服务中获取选中的课程信息
		if (_this.alreadySelectCourse.length > 0) _this.isShowCourseType = false; //如果传入参数不为空，则不显示课程类型选择框
		if (startTime) _this.selDate = new Date(startTime), _this.selStartTime = _this.tools.dataFormat(_this.selDate, "HH:mm"); //设置日期、开始时间
		if (timeZone) _this.sel.timeZone = timeZone; //设置时区
		_this.coursesTypeList = _this.search.coursesTypeList(); //获取课程体系信息
		_this.timeZoneList = _this.tools.getTimeZones(); //获取时区列表
		_this.bsConfig = Object.assign({}, {containerClass: "theme-blue"}); //日期插件参数设置
	}

	/**
	 * 选中类型，动态加载类型下数据信息
	 * @param categoryCode 类型code
	 * @param category 类型名
	 */
	selectCourseType(categoryCode, category) {
		let _this = this;
		_this.showOrHideSelectType();
		_this.selectCourseTypeInfo = category;
		_this.coursesList = _this.search.coursesList(categoryCode); //获取课程列表
	}

	/**
	 * 显示、隐藏类型选择
	 */
	showOrHideSelectType() {
		let _this = this;
		_this.showSelectType = !this.showSelectType;
	}

	/**
	 * 查询老师信息
	 */
	getTutorList() {
		let _this = this;
		_this.page = _this.student.getTutorListForCustom(_this.sel);
		let infoList = _this.tutorList.concat(_this.page.voList); //老师集合
		_this.tutorList = infoList;
		if (!_this.tutorList || _this.tutorList.length < 1) swat(SettingsService.I18NINFO.swat.e212);
	}

	/**
	 * 选择课程
	 * @param course
	 */
	selCourse(course) {
		let _this = this, asc = _this.alreadySelectCourse, isAdd: boolean = true;
		_this.courseBySelect = course.courseCode;
		asc.forEach((val, index, array) => {
			if (val.courseCode == course.courseCode) isAdd = false;
		})
		if (isAdd) asc.push(course); //设置已选列表
	}

	/**
	 * 删除所选课程
	 * @param course
	 */
	delSelCourse(course: any) {
		let _this = this, index = _this.alreadySelectCourse.indexOf(course, 0);
		if (index > -1) _this.alreadySelectCourse.splice(index, 1);
		if (_this.alreadySelectCourse.length < 1) _this.isShowCourseType = true; //当剔除所有的课程选择时，回显类型信息
	}

	/**
	 * 查找对应教师
	 */
	toSearchTutor() {
		let _this = this, time: string;
		_this.student.selectTutorList = _this.selectTutorList = new Array(); //清空已选择列表
		_this.addTutorNum = 0; //重置已选择个数
		_this.selInfo(); //设置课程编码集合
		if
		(
			isNullOrUndefined(_this.sel.courseCode) ||
			_this.sel.courseCode == "" ||
			isNullOrUndefined(_this.sel.timeZone) ||
			_this.sel.timeZone == "" ||
			isNullOrUndefined(_this.selDate)
		) {
			swat(SettingsService.I18NINFO.swat.e213);
		} else {
			// 设置开始时间和结束时间
			time = _this.tools.dataFormat(_this.selDate, "yyyy-MM-dd");
			_this.sel.startDate = time + " " + _this.selStartTime + ":00";
			_this.sel.endDate = _this.tools.dataFormat(_this.tools.getAroundHourByDate(new Date(_this.sel.startDate), 1), "yyyy-MM-dd HH:mm:ss");
			_this.sel.studentCode = _this.setting.user.studentCode;
			// 执行搜索
			_this.tutorList = new Array(); //搜索时，重置源数据
			_this.getTutorList();
		}
	}

	//处理搜索条件中的课程编码
	selInfo() {
		let _this = this;
		_this.sel.courseCode = ""; //重置
		_this.alreadySelectCourse.forEach((val, index, array) => {
			_this.sel.courseCode += "," + val.courseCode;
		})
	}

	/**
	 * 选择教师，添加到‘已选择’列表
	 * @param tutor
	 */
	toAdd(tutor) {
		let _this = this;
		_this.selectTutorList = _this.student.selectTutorList; //已选择的老师
		if (_this.selectTutorList.length < _this.tools.selectTutorUpperLimitForCustom()) {
			if (tutor) _this.student.selectTutorList.push(tutor); //添加老师
			_this.addTutorNum = _this.student.selectTutorList.length; //添加的老师个数
			tutor.isAdd = true; //标示此教师已经添加
		} else {
			swat(SettingsService.I18NINFO.swat.e214);
		}
	}

	/**
	 * 加载下一页
	 */
	loadMore() {
		let _this = this;
		_this.sel.curPage = _this.page.curPage + 1; //加载下一页内容
		_this.getTutorList(); //加载老师信息
	}

	/**
	 * 显示选择的教师
	 */
	showOrHideSelectTutor() {
		let _this = this;
		if (!_this.showSelect && _this.addTutorNum < 1) swat(SettingsService.I18NINFO.swat.e215);
		else _this.showSelect = !_this.showSelect;
	}

	/**
	 * 刪除选择的老师
	 * @param tutor
	 */
	delSelectTutor(tutor: any) {
		let _this = this;
		var index = _this.selectTutorList.indexOf(tutor, 0);
		if (index > -1) {
			tutor.isAdd = false; //页面再次设置为可选
			_this.selectTutorList.splice(index, 1); //删除对应信息
			_this.addTutorNum = _this.selectTutorList.length; //购物车个数
			if (_this.addTutorNum < 1) _this.showOrHideSelectTutor();
		}
	}

	/**
	 * 寻求老师帮助
	 */
	seekHelp() {
		let _this = this, data: any = {}, tutorCodes: string = '', ret: any;
		_this.selectTutorList.forEach((val, index, array) => {
			tutorCodes += (',' + val.tutorCode);
		})
		data.tutorCodes = tutorCodes; //教师编码
		// data.duration = (Number(_this.selEndTime.substr(0, 2)) - Number(_this.selStartTime.substr(0, 2))) * 60; //获取上课时长
		data.duration = 60; //上课时长
		data.studentCode = _this.sel.studentCode;
		data.courseCode = _this.sel.courseCode;
		data.courseTime = _this.sel.startDate;
		data.leaveMsg = _this.leaveMsg;
		ret = _this.student.customClassroomForStudent(data);
		if (ret && ret.success) {
			swat({
					title: SettingsService.I18NINFO.swat.e216,
					text: SettingsService.I18NINFO.swat.e217,
					type: "success",
					showCancelButton: true,
					confirmButtonColor: "#2f9ca9",
					confirmButtonText: SettingsService.I18NINFO.swat.e121,
					cancelButtonText: SettingsService.I18NINFO.swat.e218,
					closeOnConfirm: false,
					closeOnCancel: false
				},
				function (isConfirm) {
					swat.close();
					if (isConfirm) {
						// _this.router.navigate(["/manage/student/custom"]); //进入自定义课程首页
						window.location.reload();
					} else {
						_this.router.navigate(["/manage/student"]); //进入个人中心首页
					}
				}
			);
		} else {
			swat(SettingsService.I18NINFO.swat.e219, SettingsService.I18NINFO.swat.e220, "error")
		}
	}
}
