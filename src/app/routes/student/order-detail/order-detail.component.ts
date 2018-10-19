import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {StudentService} from '../student.service';
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
	selector: 'app-order-detail',
	templateUrl: './order-detail.component.html',
	styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit ,OnDestroy{
	public orderCode: string;      // 订单编码
	public orderData: any = {};     // 订单详情数据
	public timelineAlt: boolean = false;
	public cancelSubscribe:any;
	public orderState:number = SettingsService.enums.orderState;

	constructor(public route: ActivatedRoute, public location: Location, public student: StudentService,public settings:SettingsService) {
	}

	ngOnInit() {
		this.orderCode = this.getorderCode();           // 初始化订单编码
		this.orderData = this.student.loadOrderDetail(this.orderCode,this.settings.user.timeZone);         // 初始化订单详情信息
	};

	/**
	 * 获取URL中助教编码
	 * @returns {string}     返回助教编码
	 */
	public getorderCode() {
		let code: string;
		this.cancelSubscribe=this.route.params.subscribe(params => {
			code = params['code'];
		});
		return code;
	};

	/**
	 * 返回上一页
	 */
	goBack() {
		this.location.back();
	};

	ngOnDestroy(){
		this.cancelSubscribe.unsubscribe()
	}

}
