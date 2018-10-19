import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {CreateOrder, GoodsService} from "../goods.service";
import {CookieService} from "angular2-cookie/core";
import {MaskService} from "../../../core/services/mask.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {AppComponent} from "../../../app.component";
const swat = require("sweetalert");
declare var $: any;

@Component({
    selector: 'app-pay',
    templateUrl: './pay.component.html',
    styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
    goodsCode: string; //商品编码
    goods: any; //商品信息
    // isCoupon: any; //是否输入了正确的优惠码
    coupon: any; //优惠

    constructor(public router: Router, public routeInfo: ActivatedRoute, public goodsService: GoodsService, public cookie: CookieService, public tools: RzhtoolsService) {
    }

    ngOnInit() {
        let _this = this;
        // _this.isCoupon = localStorage.getItem('isCoupon');
        _this.goodsCode = _this.routeInfo.snapshot.queryParams['code']; //获取类型code
        if (isNullOrUndefined(_this.goodsCode)) _this.toBack(); //如果传参为空，返回商品列表页面
        else _this.goods = _this.goodsService.loadGoodsDetails(_this.goodsCode); //参数不为空，加载商品信息
    }

    /**
     * 返回购买页面
     */
    toBack() {
        this.router.navigate(["/goods"])
    }

    /**
     * 输入 优惠吗
     */
    inputCoupon(obj) {
        this.coupon = obj.target.value;

    }


    /**
     * 支付
     * 1、创建订单
     * 2、调用支付接口去支付
     */
    pay() {
        //1、创建订单
        let _this = this;
        if (_this.checkcouponCodeIsRight()) {
            _this.trueGoPay()
        } else {
            if (!isNullOrUndefined(_this.coupon)) {
                swat({
                        title: SettingsService.I18NINFO.swat.e261,
                        text: SettingsService.I18NINFO.swat.e264,
                        type: "info",
                        closeOnConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: SettingsService.I18NINFO.swat.e262,
                        cancelButtonText: SettingsService.I18NINFO.swat.e263,
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            _this.trueGoPay()
                        }
                    }
                );
            } else {
                _this.trueGoPay()
            }
        }
    }

    /**
     * 检查优惠码是否正确
     */
    checkcouponCodeIsRight() {
        let arr = JSON.parse(this.goods.couponCode);
        if (arr.length > 0) {
            let bol: boolean = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == this.coupon) {
                    bol = true;
                }
            }
            return bol;
        } else {
            if (this.coupon == this.goods.couponCode) {
                return true;
            } else {
                return false
            }
        }

    }

    /**
     * 校验完优惠券后去支付
     */
    trueGoPay() {
        let _this = this, studentInfo: any = _this.tools.getStudent(),
            order: CreateOrder = new CreateOrder();
        MaskService.showMask(); //显示遮罩层
        if (!isNullOrUndefined(studentInfo)) { //封装创建订单所需信息
            order.consumerCode = studentInfo.studentCode; //购买者编码
            order.consumerName = studentInfo.name; //购买者姓名
            order.timeZone = studentInfo.timeZone; //购买者时区
            order.consumerEmail = studentInfo.email; //购买者email
            order.goodsCode = _this.goodsCode; //商品code
            order.couponCode = _this.coupon || '';
        } else {
            MaskService.hideMask(); //隐藏遮罩层
            swat(SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e202, "error");
            return;
        }
        let data: any = _this.goodsService.createOrder(order);
        if (!isNullOrUndefined(data) && data.success) {
            $.when(_this.goodsService.payPal(data.data.orderNo)).done(function (data) {
                if (data) window.location.href = data;
            });
        } else {
            MaskService.hideMask(); //隐藏遮罩层
            swat(SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e202, "error");
        }
    }


    /**
     * 去往paypal支付页面
     */
    goPayPal() {
        let _this = this;
        swat({
                title: SettingsService.I18NINFO.swat.e106,
                text: SettingsService.I18NINFO.swat.e203,
                type: "info",
                closeOnConfirm: false,
                confirmButtonText: SettingsService.I18NINFO.swat.e107
            },
            function () {
                swat.close();
                _this.router.navigate(["/manage/student"]); //去用户中心页面
            }
        );
    }

}
