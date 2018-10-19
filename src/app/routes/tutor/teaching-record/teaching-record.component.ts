import {Component, OnInit} from '@angular/core';
import {TutorService} from '../tutor.service';
import {SettingsService} from '../../../core/settings/settings.service';
import {Router} from '@angular/router';
import {Page} from '../../../core/page/page';
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {AppComponent} from "../../../app.component";
import {Session} from "selenium-webdriver";

@Component({
	selector: 'app-teaching-record',
	templateUrl: './teaching-record.component.html',
	styleUrls: ['./teaching-record.component.css']
})
export class TeachingRecordComponent implements OnInit {
	public tutorCode: string;       // 教师编码
	public classroomData: Page= new Page();      // 已完结课堂数据
	public classroomNoWriteData: Page= new Page();      // 已完结未填写课堂数据
	public classroomState:number = SettingsService.enums.classroomState;
	public selectedIndex: string = '0';

	constructor(public tutor: TutorService, public settings: SettingsService, public router: Router,public tool:RzhtoolsService) {
	}

	ngOnInit() {
		let curPage = 1;
		let finishPageSize = Number(sessionStorage.getItem('teacherYeild')) ?Number(sessionStorage.getItem('teacherYeild'))*9: 9;
		let noPageSize = Number(sessionStorage.getItem('teacherNo')) ?Number(sessionStorage.getItem('teacherNo'))*9: 9;
		this.tutorCode = this.settings.user.tutorCode;          // 初始化教师编码
		let data = this.tutor.getFinshedClassroom(this.tutorCode, curPage, finishPageSize,this.settings.user.timeZone);
		let noData = this.tutor.getNoWriteClassroom(this.tutorCode, curPage, noPageSize,this.settings.user.timeZone);
		this.classroomData = new Page(data);                // 获取并封装已完结课程数据
		this.classroomNoWriteData = new Page(noData);                // 获取并封装已完结课程数据
		this.feedbackAlert();
	}

	/**
	 * 在获取到学生有课程没有评价的时候进行弹框提醒（类似文件调查的回馈表）
	 */
	feedbackAlert() {
		if (this.classroomNoWriteData.voList.length>0) {  //如果有一条没有评论，就跳转填写课后问卷的卡片列表页
			this.selectedIndex = '2';
			AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.alertTitle, SettingsService.I18NINFO.swat.alertContent);
		}
	}

	/**
	 * 跳转至课堂详情
	 * @param classroomCode         课堂编码
	 */
	goDetail(classroomCode) {
		this.router.navigate(['/manage/tutor/detail', classroomCode]);
	}

	/**
	 * 跳转到课后评价页面
	 *
	 */
	goWrite(classroomCode, tutorCode,studentCode) {
		this.router.navigate(['/manage/tutor/feedback', classroomCode, tutorCode,studentCode]);
	}

	/**
	 * 授课记录获取更多
	 */
	roomLoadMore() {
		let curentPage=this.classroomData.pageSize/9==1?this.classroomData.curPage:this.classroomData.pageSize/9;
		let curPage = ++curentPage,
			pageSize =9;
		sessionStorage.setItem('teacherYeild',String(curPage));
		let data = this.tutor.getFinshedClassroom(this.tutorCode,curPage, pageSize,this.settings.user.timeZone);
		let voList = this.classroomData.voList.concat(data.voList);
		this.classroomData = new Page(data);
		this.classroomData.voList = voList;
	}

	/**
	 * 问卷获取更多
	 */
	questionLoadMore() {
		let curentPage=this.classroomNoWriteData.pageSize/9==1?this.classroomNoWriteData.curPage:this.classroomNoWriteData.pageSize/9;
		let curPage = ++curentPage,
			pageSize = 9;
		sessionStorage.setItem('teacherNo',String(curPage));
		let data = this.tutor.getNoWriteClassroom(this.tutorCode, curPage, pageSize,this.settings.user.timeZone);
		let voList = this.classroomNoWriteData.voList.concat(data.voList);
		this.classroomNoWriteData = new Page(data);
		this.classroomNoWriteData.voList = voList;
	}
}
