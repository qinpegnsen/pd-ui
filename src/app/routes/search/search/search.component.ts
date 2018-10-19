import {Component, OnInit} from "@angular/core";
import {SearchService} from "../search.service";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {Page} from "../../../core/page/page";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {CookieService} from "angular2-cookie/core";
const swat = require("sweetalert");

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	courseList: Array<any> = new Array(); //课程列表
	bsConfig: Partial<BsDatepickerConfig>; //日期插件参数
	timeList: Array<any> = SettingsService.timeList; //时间列表
	coursesTypeList: Array<any> = new Array(); //课程体系列表
	showSelectType: boolean; //显示、隐藏课程类型选择
	selectCourseTypeInfo: string = null; //选中的课程类型名
	alreadySelectCourse: Array<any> = new Array(); //已选课程列表
	page: Page; //分页信息
	curPage: number = 1; //当前页
	pageSize: number = 25; //每页条数
	minDate: any= new Date(); //每页条数
	sel: any = {//查询参数
		curPage: this.curPage,
		pageSize: this.pageSize,
		courseCode: "",
		courseType: "",
		startDate: "",
		endDate: "",
		timeZone: ""
	};
	selDate: any; //所选日期
	selStartTime: string = "00:00"; //起始时间
	selEndTime: string = "23:59"; //结束时间
	timeZone: Array<any>; //时区集合
	selTimeZone: string; //时区
	tutorList: Array<any> = new Array(); //老师集合
	courseBySelect: string; //选择的课程编码
	courseTranslate: Array<any> = new Array(); //课程类型
	hotCourseList: Array<any> = new Array(); //获取热门课程的信息
	selCourseTranslate: string = SettingsService.courseTranslate; //选中的课程类型
	translateIsCourse: boolean = true; //是否为普通课程
	isShowCustom: boolean = true; //是否显示自定义按钮

	constructor(public search: SearchService, public cookieService: CookieService,public tools: RzhtoolsService, public router: Router, public routeInfo: ActivatedRoute) {
	}

	ngOnInit() {
		let _this = this, courseCodes: string;
		let sessionId = this.cookieService.get(SettingsService.sessionId);  // 获取登陆状态
		if ( !sessionId ) {
			this.router.navigate(['/pages/login'], {replaceUrl: true});
		} // 路由跳转
		_this.courseTranslate = _this.tools.getEnumDataList(SettingsService.enums.courseTranslate); //获取课堂类型
		_this.bsConfig = Object.assign({}, {containerClass: "theme-blue"}); //日期插件参数
		_this.coursesTypeList = _this.search.coursesTypeList(); //获取课程体系信息
		_this.timeZone = _this.tools.getTimeZones(); //获取时区列表
		//完善搜索信息 begin
		courseCodes = _this.routeInfo.snapshot.queryParams['courseCodes']; //获取路由中传入的课程编码
		if (!isNullOrUndefined(courseCodes) && courseCodes !== "") {
			let ids: string[] = courseCodes.split(","), ret: any = {};
			for (let i = 0; i < ids.length; i++) {
				ret = _this.search.loadCourse(ids[i]);
				if (ret.success) _this.alreadySelectCourse.push(ret.data);
			}
			_this.selInfo(); //完善搜索条件
		}
		//完善搜索信息 end
		_this.getTutorList(); //搜索教师信息
		_this.tools.selMenu("/search"); //顶部菜单选中
		_this.getHotCourse();
	}

	/**
	 * 显示、隐藏类型选择
	 */
	showOrHideSelectType() {
		let _this = this;
		_this.showSelectType = !this.showSelectType;
	}

	/**
	 * 获取热门课程
	 */
	getHotCourse(){
		this.hotCourseList=this.search.getHotCourseList()
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
		_this.courseList = _this.search.coursesList(categoryCode); //获取课程列表
	}

	/**
	 * 选择课程
	 * @param course
	 */
	selCourse(course,bol?) {
		let _this = this, asc = _this.alreadySelectCourse, isAdd: boolean = true;
		_this.courseBySelect = course.courseCode;
		asc.forEach((val, index, array) => {
			if (val.courseCode === course.courseCode) isAdd = false;
		})
		if (isAdd) asc.push(course); //设置已选列表
		_this.selCourseBySelect(bol);
	}

	/**
	 * 删除所选课程
	 * @param course
	 */
	delSelCourse(course: any) {
		let _this = this, index = _this.alreadySelectCourse.indexOf(course, 0);
		if (index > -1) _this.alreadySelectCourse.splice(index, 1);
	}

	/**
	 * select框选择课程（手机端用）
	 */
	selCourseBySelect(bool?) {
		if(!bool){           //正常的课程
			let _this = this, course: any;
			_this.courseList.forEach((val, index, array) => {
				if (val.courseCode != _this.courseBySelect) val.sel = false;
				else val.sel = !val.sel, course = val;
			})
			if (course.sel) _this.sel.courseCode = _this.courseBySelect;//设置课程编码
			else _this.sel.courseCode = "";//清空编码
		}else{               //热点的课程
			let _this = this, course: any;
			_this.hotCourseList.forEach((val, index, array) => {
				if (val.courseCode != _this.courseBySelect) val.sel = false;
				else val.sel = !val.sel, course = val;
			})
			if (course.sel) _this.sel.courseCode = _this.courseBySelect;//设置课程编码
			else _this.sel.courseCode = "";//清空编码
		}
	}

	/**
	 * 执行搜索
	 */
	toSel() {
		let _this = this, time: string;
		if (_this.selDate) {
			if (!_this.selTimeZone) {
				swat(SettingsService.I18NINFO.swat.e211);
				return;
			}
			// _this.sel.timeZone = _this.selTimeZone;
			time = _this.tools.dataFormat(_this.selDate, "yyyy-MM-dd");
			_this.sel.startDate = _this.tools.timeZoneDateToUTC(time + " " + _this.selStartTime + ":00", _this.selTimeZone); //查询时间处理，时间转换
			_this.sel.endDate = _this.tools.timeZoneDateToUTC(time + " " + _this.selEndTime + ":00", _this.selTimeZone); //查询时间处理，时间转换
		}
		_this.selInfo(); //完善搜索条件
		_this.tutorList = new Array(); //搜索时，重置源数据
		_this.getTutorList(); //绘制列表

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
	 * 重置搜索信息
	 */
	toReset() {
		let _this = this;
		_this.curPage = 1; //第一页
		_this.sel = {//查询参数
			curPage: _this.curPage,
			pageSize: _this.pageSize,
			courseCode: "",
			courseType: "",
			startDate: "",
			endDate: "",
			timeZone: ""
		};
		_this.selDate = null; //所选日期
		_this.selStartTime = "00:00"; //起始时间
		_this.selEndTime = "23:59"; //结束时间
		_this.selTimeZone = ""; //时区
		_this.courseList.forEach((val, index, array) => { //所需课程重置
			val.sel = false;
		});
		_this.hotCourseList.forEach((val, index, array) => { //所需热门课程重置
			val.sel = false;
		});
		_this.alreadySelectCourse=new Array();
		_this.toSel();
	}

	/**
	 * 查询老师信息
	 */
	getTutorList() {
		let _this = this;
		_this.sel.courseType = _this.selCourseTranslate; //课程类型
		_this.page = _this.search.tutorList(_this.sel); //查询老师信息
		let infoList = _this.tutorList.concat(_this.page.voList || []); //老师集合
		_this.tutorList = infoList;
	}

	/**
	 * 切换类型
	 */
	selTranslate(val: string) {
		let _this = this;
		_this.selCourseTranslate = val;
		if (_this.selCourseTranslate != SettingsService.courseTranslate) {
			_this.translateIsCourse = false; //不显示课程分类
			_this.courseList = new Array(); //清空课程列表
			_this.selectCourseTypeInfo = null; //清空课程分类选择
			_this.alreadySelectCourse = new Array(); //清空所选课程
			_this.isShowCustom = false; //不显示自定义按钮
		} else {
			_this.translateIsCourse = true; //显示课程分类
			_this.isShowCustom = true; //显示自定义按钮
		}
		_this.toReset(); //重置搜索条件
		_this.toSel(); //执行搜索
	}

	/**
	 * 去往详情页面
	 * @param code 教师编码
	 */
	toDetails(code) {
		let _this = this;
		_this.router.navigate(["/search/details"], {queryParams: {code: code}});
	}

	/**
	 * 去预约上课
	 */
	toBespoke(code) {
		let _this = this;
		_this.router.navigate(["/order/timetable"], {queryParams: {code: code}});
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
	 * 去自定义课程
	 */
	goCustom() {
		let _this = this, isLogin = RzhtoolsService.checkLogin(true); //判断是否登录
		if (_this.selDate) { //设置开始和结束时间
			let time = _this.tools.dataFormat(_this.selDate, "yyyy-MM-dd");
			SettingsService.alreadySelectStartTime = time + " " + _this.selStartTime + ":00";
			SettingsService.alreadySelectEndTime = time + " " + _this.selEndTime + ":00";
		}
		if (_this.selTimeZone) SettingsService.alreadySelectTimeZone = _this.selTimeZone;//设置时区
		SettingsService.alreadySelectCourse = _this.alreadySelectCourse; //设置已选课程到服务变量中
		if (isLogin) _this.router.navigate(["/manage/student/custom"]); //处于登录时，进入自定义课程页面
		else swat(SettingsService.I18NINFO.swat.e110);//处于未登录时
	}
}
