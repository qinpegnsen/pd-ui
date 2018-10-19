import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {SettingsService} from "../../../core/settings/settings.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TutorService} from "../../tutor/tutor.service";
import { TranslateService } from '@ngx-translate/core';
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
const screenfull = require('screenfull');

@Component({
	selector: 'app-courseware',
	templateUrl: './courseware.component.html',
	styleUrls: ['./courseware.component.css']
})
export class CoursewareComponent implements OnInit {
	public showLiftMsg: boolean = true;
	public iframeUrl: string;
	public coursewareList: Array<any> = new Array(); //当前课堂对应的所有课件
	public selCourseware: any; //正在浏览的课件
	public courseDuration: number = 0; //上课时长
	public classroomCode: string; //课程编码
	public lang: string;

	constructor(public location: Location, public routeInfo: ActivatedRoute, public tutor: TutorService, public settings: SettingsService, public router: Router, public translate: TranslateService, public tools: RzhtoolsService) {
	}

	ngOnInit() {
		let _this = this, tutorCode: string, timeZone: string, classroomData: any;
		_this.classroomCode = _this.routeInfo.snapshot.queryParams['code']; //获取课程code
		_this.lang = _this.routeInfo.snapshot.queryParams['lang']; //获取课程code
		if (!_this.classroomCode) _this.location.back(); //未获取课程编码时，返回上一步
		tutorCode = _this.settings.user.tutorCode;       // 初始化教师编码
		timeZone = _this.settings.user.timeZone;       // 初始化时区
		classroomData = _this.tutor.loadAll(_this.classroomCode, tutorCode, timeZone); //获取详情信息
		if (!classroomData) _this.location.back(); //未获取课程信息时，返回上一步
		_this.coursewareList = classroomData.courseTimetable.courseCourseWares; //获取课件列表
		_this.selCourseware = SettingsService.selCourseware; //获取所选课件
		if (!_this.selCourseware) _this.selCourseware = _this.coursewareList[0]; //若找不到所选课表信息，则显示第一个
		_this.courseDuration = classroomData.duration; //获取上课时长
		_this.iframeUrl = _this.selCourseware.courseWare.downloadUrl; //获取课件地址
		setTimeout(() => { //iframe 自动高度
			let ifm: any = document.getElementById("courseware");
			ifm.height = document.documentElement.clientHeight;
		}, 0);
		SettingsService.selectLanguage = _this.lang; //设置选中的语言信息
		_this.settings.checkMenu();
		_this.translate.use(_this.lang.match(/en|zh/) ? _this.lang : 'en');
		_this.tools.getI18nInfos(_this.lang); //获取国际化信息
	}

	/**
	 * 显示/隐藏 左侧信息栏目
	 */
	showMsg() {
		this.showLiftMsg = !this.showLiftMsg;
	}

	/**
	 * 全屏查看
	 */
	fullScreen() {
		const el = document.getElementById('courseware');
		if (screenfull.enabled) {
			screenfull.request(el);
		}
	}

	/**
	 * 返回上一步
	 */
	back() {
		let _this = this;
		_this.router.navigate(['/manage/tutor/detail', _this.classroomCode]);
	}

	/**
	 * 选中课程
	 */
	selWare(ware: any) {
		let _this = this;
		_this.selCourseware = ware;
		_this.iframeUrl = _this.selCourseware.courseWare.downloadUrl; //获取课件地址
	}
}
