import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {StudentService} from '../student.service';
import {Router} from '@angular/router';
import {OrderService} from "../../order/order.service";
const swat = require("sweetalert");

@Component({
	selector: 'app-student-center',
	templateUrl: './student-center.component.html',
	styleUrls: ['./student-center.component.css']
})
export class StudentCenterComponent implements OnInit {
	public studentCode: string;            // 学生编码
	public studentData: any = {};           // 学生信息数据
	public bookClassromm: any = {};         // 预约课堂数据
	public confirmedClassroom: any = {};    // 待上课课堂数据
	public allCourseHour: number;
	public courseHour: number;
	public courseHourShare: number;
	public courseHourStage: number;
	public custom:string = SettingsService.custom; //自定义预约类型
	public attend:string = SettingsService.attend; //教师出席状态
	public overdue:string = SettingsService.overdue; //预约课程过期未处理状态

	constructor(public settings: SettingsService, public student: StudentService, public router: Router) {
	}

	ngOnInit() {
		let _this = this,student:any = _this.settings.user; //获取登录用户的信息
		_this.studentCode = _this.settings.user.studentCode;               // 初始化获取学生编码
		_this.studentData = _this.student.getDetail(_this.studentCode);      // 初始化学生信息数据
		_this.bookClassromm = _this.student.getBookClassroom(_this.studentCode, student.timeZone);    // 初始化学生预约课堂数据
		_this.confirmedClassroom = _this.student.getConfirmedClassroom(_this.studentCode,student.timeZone);      // 初始化待上课课堂数据
		_this.student.bookClassroomMore(_this.bookClassromm,student.timeZone);                    // 封装处理预约课堂数据（加入教师信息）
		_this.student.confirmedClassroomMore(_this.confirmedClassroom);          // 封装处理待上课课堂数据（加入教师信息）
		_this.courseHour = _this.studentData.courseHour ? Number(_this.studentData.courseHour.courseHour) : 0;
		if(_this.studentData.courseHourShareStudent){
			_this.courseHourShare = Number(_this.studentData.courseHourShareStudent.upperLimit) - Number(_this.studentData.courseHourShareStudent.usedHours);
		}else {
			_this.courseHourShare = 0;
		}
		_this.courseHourStage = _this.studentData.courseHourStage ? Number(_this.studentData.courseHourStage.courseHour) : 0;
		_this.allCourseHour = _this.courseHour + _this.courseHourStage;
	};



	/**
	 * 学生收藏教师
	 * @param tutorCode          收藏的教师编码
	 * @param bl         布尔值：true则取消收藏教师， false则收藏教师
	 */
	favorite(tutorCode, bl) {
		bl ? this.student.delfavorite(tutorCode, this.studentCode) : this.student.favorite(tutorCode, this.studentCode);
	};

	/**
	 * 跳转至课堂详情
	 * @param classroomCode                 课堂编码
	 */
	goDetail(classroomCode) {
		this.router.navigate(['/manage/student/detail', classroomCode]);
	};

}
