import { Page } from './../../../core/page/page';
import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {TutorService} from "../../tutor/tutor.service";
import {StudentService} from "../../student/student.service";
import {SearchService} from "../search.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
const swat = require("sweetalert");

@Component({
	selector: 'app-tutor-details',
	templateUrl: './tutor-details.component.html',
	styleUrls: ['./tutor-details.component.css']
})
export class TutorDetailsComponent implements OnInit {
	public tutorCode: string; //教师编码
	tutor: any; //教师信息
	public isFavorite: boolean = false;
	public studentCode: string; //学生code
	public feedbackData: Page= new Page(); //学生评价数据
  	public isReadonly: boolean = true;

	constructor(public activatedRoute: ActivatedRoute, public tutorService: TutorService, public studentService: StudentService, public searchService: SearchService, public setting: SettingsService, public location: Location, public router: Router) {
	}

	ngOnInit() {
		let _this = this;
		_this.studentCode = _this.setting.user.studentCode;
		_this.tutorCode = _this.activatedRoute.snapshot.queryParams['code'];
		_this.tutor = _this.tutorService.loadForTotal(_this.tutorCode);
		_this.feedbackData = _this.searchService.queryFeedbackList(1, 10, _this.tutorCode, 'Student');
		if (!isNullOrUndefined(_this.studentCode)) _this.isFavorite = _this.studentService.checkIsFavorite(_this.tutorCode, _this.studentCode);
	}

	/**
	 * 返回上一页
	 */
	toBack() {
		this.location.back();
	}

	/**
	 * 去预约上课
	 */
	toBespoke() {
		let _this = this;
		_this.router.navigate(["/order/timetable"], {queryParams: {code: _this.tutorCode}});
	}

	/**
	 * 收藏老师
	 * 1、判断是否登录
	 * 2、收藏
	 */
	toFavorite() {
		let _this = this, isLogin = RzhtoolsService.checkLogin(true);
		if (isLogin) {
			_this.studentService.favorite(_this.tutorCode, _this.studentCode, (res) => {
				_this.isFavorite = !_this.isFavorite;
			});
		}else{
			swat(SettingsService.I18NINFO.swat.e110);
		}
	}

	/**
	 * 获取更多评论
	 */
	loadMore() {
		let data: Page = this.searchService.queryFeedbackList(++this.feedbackData.curPage, 10, this.tutorCode, 'Student');
		data.voList = this.feedbackData.voList.concat(data.voList);
		this.feedbackData = data;
	}
}
