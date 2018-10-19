import {Component, OnInit} from "@angular/core";
import {SettingsService} from "../../../core/settings/settings.service";
import {StudentService} from "../student.service";
import {Router} from "@angular/router";
import {Page} from "../../../core/page/page";

@Component({
	selector: 'app-my-order',
	templateUrl: './my-order.component.html',
	styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {
	public studentCode: string;            // 学生编码
	public studentData: any = {};          // 学生数据
	public bookClassromm: any = {};        // 预约课堂数据
	public cancelClassromm: Array<any> = new Array(); // 取消预约课堂数据
	public cancelClassrommPage: Page; //分页信息
	curPage: number = 1; //当前页
	pageSize: number = 12; //每页条数
	public custom:string = SettingsService.custom; //自定义预约类型
	public overdue:string = SettingsService.overdue; //预约课程过期未处理状态

	constructor(public settings: SettingsService, public student: StudentService, public router: Router) {
	}

	ngOnInit() {
		let _this = this;
		_this.studentCode = _this.settings.user.studentCode;             // 初始化学生编码
		_this.studentData = _this.student.getDetail(_this.studentCode);      // 初始化学生数据
		_this.bookClassromm = _this.student.getBookClassroom(_this.studentCode, _this.settings.user.timeZone);       // 初始化预约课堂数据
		_this.student.bookClassroomMore(_this.bookClassromm,_this.settings.user.timeZone);                // 封装处理预约课堂数据（加入教师信息）
		_this.cancelClassrommPage = _this.student.cancelClassroom(_this.curPage,_this.pageSize,_this.studentCode,_this.settings.user.timeZone); //获取取消预约的课堂信息
		_this.cancelClassromm = _this.cancelClassrommPage.voList;
	}

	/**
	 * 跳转至课堂详情
	 * @param classroomCode                 课堂编码
	 */
	goDetail(classroomCode) {
		this.router.navigate(['/manage/student/detail', classroomCode]);
	};

	/**
	 * 取消列表获取更多
	 */
	orderLoadMore() {
		let _this=this;
		let volist=_this.cancelClassromm;
		_this.cancelClassrommPage = _this.student.cancelClassroom(++_this.curPage,_this.pageSize,_this.studentCode,_this.settings.user.timeZone);
		let result=volist.concat(_this.cancelClassrommPage.voList);
		_this.cancelClassromm = result;
	}

}
