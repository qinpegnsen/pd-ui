import {Injectable} from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";
import {Page} from "../../core/page/page";
import {Router} from "@angular/router";
import {MaskService} from "../../core/services/mask.service";
import {SettingsService} from "../../core/settings/settings.service";
const swat = require("sweetalert");
declare var $: any;

@Injectable()
export class GoodsService {

	constructor(public ajax: AjaxService, public router: Router) {
	}

	/**
	 * 查询商品列表（只查询状态为‘正常’的商品）
	 * @param curPage 第几页
	 * @param pageSize 每页条数
	 * @param state 商品状态
	 * @returns {Page}
	 */
	goodsList(curPage, pageSize) {
		let _this = this, ret: Page = new Page();
		_this.ajax.get({
			url: "/goods/goods",
			mask: true,
			data: {curPage: curPage, pageSize: pageSize, state: SettingsService.goodsCommon},
			async: false,
			success: (response) => {
				if (response.success) ret = response.data;
			}
		})
		return ret;
	}

	/**
	 * 加载一个商品详情
	 * @param goodsCode
	 * @returns {any}
	 */
	loadGoodsDetails(goodsCode) {
		let _this = this, data: any;
		_this.ajax.get({
			url: "/goods/loadgoodsdetail",
			mask: true,
			data: {goodsCode: goodsCode},
			async: false,
			success: (response) => {
				if (response.success) data = response.data;
			}
		})
		return data;
	}

	/**
	 * 创建订单
	 * @param order
	 */
	createOrder(order: CreateOrder) {
		let _this = this, data: any;
		_this.ajax.post({
			url: "/order/order",
			data: order,
			async: false,
			success: (response) => {
				data = response;
			}
		})
		return data;
	}

	/**
	 * payPal支付
	 * @orderNo 订单编码
	 */
	payPal(orderNo: string) {
		let _this = this, defer = $.Deferred(); //defer 处理异步请求无法返回值的问题
		_this.ajax.post({
			url: "/order/payment",
			data: {orderNo: orderNo},
			// mask:true,
			success: (response) => {
				if (response.success) {
					defer.resolve(response.data);
				} else _this.payError();
			},
			error: (response) => {
				_this.payError();
			}
		});
		return defer.promise();
	}

	//支付失败提示
	public payError() {
		MaskService.hideMask(); //隐藏遮罩层
		let _this = this;
		swat({
				title: SettingsService.I18NINFO.swat.e108,
				text: SettingsService.I18NINFO.swat.e204,
				type: "error",
				closeOnConfirm: false
			},
			function () {
				_this.router.navigate(["/goods"]);
				swat.close();
			}
		);
	}
}


/**
 * 创建订单（工具类）
 */
export class CreateOrder {
	consumerCode: string; //购买者编码
	consumerName: string; //购买者姓名
	timeZone: string;  //购买者时区
	consumerEmail?: string;  //购买者email
	goodsCode: string;  //商品code
	goodsNum?: string; //购买数量
	couponCode?: string; //优惠券
}
