import {Component, OnInit} from '@angular/core';
import {OrderComponent} from "../order/order.component";
import {OrderService, Times} from "../order.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";

@Component({
	selector: 'app-order-complete',
	templateUrl: './order-complete.component.html',
	styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {
	successInfo: SuccessInfo = new SuccessInfo(); //成功信息

	constructor(public orderComponent: OrderComponent, public orderService: OrderService, public setting: SettingsService, public tools: RzhtoolsService) {
		orderComponent.stepConfirm = true; //顶部进度选中第二步
		orderComponent.stepOK = true; //顶部进度选中第三步
	}

	ngOnInit() {
		//获取并封装页面显示信息
		let _this = this, leaveMsg = _this.orderService.leaveMsg||localStorage.getItem('leaveMsg'), tutor = _this.orderService.tutor||JSON.parse(localStorage.getItem('tutor')),
			selOrderInfo: Array<Times> = _this.orderService.selTimetableInfo||JSON.parse( localStorage.getItem('timetableInfo')), userInfo: any = _this.setting.user;
		if (!isNullOrUndefined(userInfo)) _this.successInfo.studentName = userInfo.name; //学员姓名
		if (!isNullOrUndefined(tutor)) _this.successInfo.tutorName = tutor.name; //教师姓名
		if (!isNullOrUndefined(selOrderInfo)) {
			_this.successInfo.course = selOrderInfo[0].course; //课程(单条数据如此写)
			_this.successInfo.courseTime = selOrderInfo[0].courseTime; //课程开始时间
			_this.successInfo.courseEndTime = selOrderInfo[0].courseEndTime; //课程结束时间
		}
		if (!isNullOrUndefined(leaveMsg)) _this.successInfo.leaveMsg = leaveMsg; //预约留言
		if(_this.successInfo.leaveMsg =='undefined'){
			_this.successInfo.leaveMsg=null;
		}
	}

	/**
	 * 去往目标页面并选中
	 * @param url
	 */
	go(url) {
		this.tools.selMenu(url);
	}

}

/**
 * 成功信息
 */
export class SuccessInfo {
	studentName: string;
	tutorName: string;
	course: string;
	courseTime: number;
	courseEndTime: number;
	leaveMsg: any;
}
