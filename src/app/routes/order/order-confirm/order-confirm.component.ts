import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {SettingsService} from "../../../core/settings/settings.service";
import {OrderComponent} from "../order/order.component";
import {OrderInfo, OrderService, Times} from "../order.service";
import {isNullOrUndefined} from "util";
import {Router} from "@angular/router";
import {AppComponent} from "../../../app.component";
const swat = require("sweetalert");

@Component({
    selector: 'app-order-confirm',
    templateUrl: './order-confirm.component.html',
    styleUrls: ['./order-confirm.component.css']
})
export class OrderConfirmComponent implements OnInit {
    showRemark: boolean = true; //是否显示备注信息（手机时不显示）
    tutor: any; //教师信息
    timetable: Array<Times>; //选择的课程
    leaveMsg: string; //留言信息

    constructor(public orderComponent: OrderComponent, public orderService: OrderService, public location: Location, public router: Router) {
        orderComponent.stepConfirm = true; //顶部步骤选中第二步
    }

    ngOnInit() {
        const _this = this;
        _this.tutor = _this.orderService.tutor||JSON.parse(localStorage.getItem('tutor')); //获取教师信息
        _this.timetable = _this.orderService.selTimetableInfo||JSON.parse( localStorage.getItem('timetableInfo')); //获取已选择的课程信息
        if (isNullOrUndefined(_this.tutor) || isNullOrUndefined(_this.timetable)) { //若信息没拿到
            _this.location.back(); //返回上一页
        }
        if (window.innerWidth < SettingsService.mobileMaxWidth) _this.showRemark = false; //手机时不显示备注
    }

    /**
     * 删除所选课程
     */
    todelete() {
        this.location.back(); //返回上一页
    }

    /**
     * 提交预约信息
     */
    toSubmit() {
        let _this = this, orderInfo: OrderInfo = new OrderInfo(), ret: any;
        let selInfo = _this.timetable[0]; //选择的课程（目前此处理方式仅支持单条）
        _this.orderService.leaveMsg = _this.leaveMsg; //留言信息放入服务
        localStorage.setItem('leaveMsg',_this.leaveMsg);
        // _this.timetable.forEach((val, index, array) => { //多条处理，目前用不到
        // })
        orderInfo = _this.orderService.setOrderInfo(selInfo, _this.leaveMsg); //设置提交参数
        ret = _this.orderService.classroomBook(orderInfo); //创建预约信息
        if (!isNullOrUndefined(ret)) {
            if (ret.success) {//预约信息创建成功
                _this.router.navigate(['/order/complete']); //进入预约成功页面
            } else {
                if (ret.data.code == 4003) {                //超过预约时间
                    AppComponent.rzhAlt('info', SettingsService.I18NINFO.swat.e255);
                    _this.location.back();
                } else if (ret.data.code == 4005) {             //课程不存在
                    AppComponent.rzhAlt('info', SettingsService.I18NINFO.swat.noLesson);
                    _this.location.back();
                } else if(ret.data.code == 8151){          //当前时间已经有课程了
                    swat(
                        {
                            title: SettingsService.I18NINFO.swat.e205,
                            text: SettingsService.I18NINFO.swat.e258,
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#30a4b6",
                            confirmButtonText: SettingsService.I18NINFO.swat.e260,
                            cancelButtonText: SettingsService.I18NINFO.swat.e259,
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            swat.close();
                            if (isConfirm)  _this.router.navigate(['/manage/student']); //去购买页面
                            else _this.location.back(); //返回上一页
                        }
                    );
                }else {
                    swat(
                        {
                            title: SettingsService.I18NINFO.swat.e205,
                            text: SettingsService.I18NINFO.swat.e206,
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#30a4b6",
                            confirmButtonText: SettingsService.I18NINFO.swat.e207,
                            cancelButtonText: SettingsService.I18NINFO.swat.e109,
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            swat.close();
                            if (isConfirm) _this.router.navigate(['/goods']); //去购买页面
                            else _this.location.back(); //返回上一页
                        }
                    );
                }
            }
        } else {
            swat(SettingsService.I18NINFO.swat.e208, SettingsService.I18NINFO.swat.e209, "error");
        }
    }
}
