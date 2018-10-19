import {Component, OnInit} from "@angular/core";
import {Page} from "../../../core/page/page";
import {GoodsService} from "../goods.service";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SettingsService} from "../../../core/settings/settings.service";
import {AppComponent} from "../../../app.component";
declare var $: any;
const swat = require("sweetalert");

@Component({
	selector: 'app-goods',
	templateUrl: './goods.component.html',
	styleUrls: ['./goods.component.css']
})
export class GoodsComponent implements OnInit {
	page: Page; //接受page对象
	pageSize: number = 20; //分页步长
	goodsList: Array<any> = new Array(); //数据源

	constructor(public goodsService: GoodsService, public router: Router, public route: ActivatedRoute, public tools: RzhtoolsService) {
	}

	ngOnInit() {
		const _this = this;
		_this.queryGoods(1); //加载第一页信息
		//设置商品图片的大小，且窗口发生变化时，比例不变
		_this.editImg();
		$(window).resize(function () { //当浏览器大小变化时
			_this.upImg();
		});
	}

	/**
	 * 显示详情信息
	 */
	showDetail(goods) {
		window.location.href=goods.detailLink;
		// goods.isShow = !goods.isShow;
		// setTimeout(() => {
		// 	goods.showDetails = !goods.showDetails;
		// }, 1);
	}

	/**
	 * 加载更多
	 */
	loadMore() {
		let _this = this;
		_this.queryGoods(++_this.page.curPage);
	}


	/**
	 * 购买课时商品
	 */
	payGoods(goodsCode) {
		let _this = this, isLogin = RzhtoolsService.checkLogin(true); //判断是否登录
		if (isLogin) { //处于登录时，进入支付页面
			_this.router.navigate(["pay"], {
				queryParams: {code: goodsCode},
				skipLocationChange: true,         //不追加到地址的历史记录里面，所以看起来地址没有变化（其实只是看不见而已）
				relativeTo: _this.route         //相对于当前路由跳转
			});
		} else { //处于未登录时
			swat(SettingsService.I18NINFO.swat.e110);
		}
	}


	/***************************************************** 私有服务 begin *********************************************/
	/**
	 * 设置图片统一风格
	 */
	public editImg() {
		const _this = this;
		setTimeout(() => {
			_this.upImg();
		}, 1);
	}

	/**
	 * 设置图片统一风格（私有，内部调用）
	 */
	public upImg() {
		$(".goods .goods-list .goods-img img").height($(".goods .goods-list .goods-img").width() * 3 / 5);
	}

	/**
	 * 获取商品信息（私有）
	 * @param curPage
	 */
	public queryGoods(curPage) {
		let _this = this;
		_this.page = _this.goodsService.goodsList(curPage, _this.pageSize); //查询商品信息
		if (!isNullOrUndefined(_this.page.voList)) {
			let infoList = _this.goodsList.concat(_this.page.voList); //填充数据
			_this.goodsList = infoList;
			_this.editImg(); //设置图片统一风格
		}
	}

	/***************************************************** 私有服务 end ***********************************************/
}
