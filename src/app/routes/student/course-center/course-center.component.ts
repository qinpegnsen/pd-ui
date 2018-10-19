import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../../core/page/page';
import {SettingsService} from '../../../core/settings/settings.service';
import {StudentService} from '../student.service';
import {Router} from '@angular/router';
import {AppComponent} from "../../../app.component";

@Component({
    selector: 'app-course-center',
    templateUrl: './course-center.component.html',
    styleUrls: ['./course-center.component.css']
})
export class CourseCenterComponent implements OnInit {
    public studentCode: string;            // 学生编码
    public endedClassroom: Page = new Page();       // 已完结课堂数据
    public noWriteClassroomData: Page = new Page();       // 已完结课堂为评价数据
    public orders: Page = new Page();          // 订单数据
    public studentData: any;
    public allCourseHour: number;
    public courseHour: number;
    public courseHourEndTime: string;
    public courseHourShare: number;
    public courseHourShareEndTime: string;
    public upperLimit: number;
    public useCourseHour: number;
    public courseHourStage: number;
    public courseHourStageEndTime: string;
    public classroomState: number = SettingsService.enums.classroomState;
    public orderState: number = SettingsService.enums.orderState;
    public attend: string = SettingsService.attend;
    public custom: string = SettingsService.custom;
    public selectedIndex: string = '0';
    @ViewChild('buy') buy;

    constructor(public settings: SettingsService, public student: StudentService, public router: Router) {
    }

    ngOnInit() {
        this.studentCode = this.settings.user.studentCode;       // 初始化学生编码
        this.studentData = this.student.getDetail(this.studentCode);
        let data = this.student.getEndedClassroom(this.studentCode, 1, Number(sessionStorage.getItem('stuYeild')) ?Number(sessionStorage.getItem('stuYeild'))*9: 9, this.settings.user.timeZone);
        this.endedClassroom = new Page(data);              // 初始化已完结课堂数据
        let noWriteData = this.student.getNoWriteClassroom(this.studentCode, 1, Number(sessionStorage.getItem('stuNo')) ?Number(sessionStorage.getItem('stuNo'))*9: 9, this.settings.user.timeZone);
        this.noWriteClassroomData = new Page(noWriteData);              // 初始化已完结未评价课堂数据
        let orderData = this.student.getOrders(this.studentCode,  1, Number(sessionStorage.getItem('stuOrder')) ?Number(sessionStorage.getItem('stuOrder'))*9:  9, this.settings.user.timeZone);
        this.orders = new Page(orderData);                 // 初始化订单数据
        this.courseHour = this.studentData.courseHour ? Number(this.studentData.courseHour.courseHour) : 0;
        this.courseHourEndTime = this.studentData.courseHour ? this.studentData.courseHour.endTime : '';
        if (this.studentData.courseHourShareStudent) {
            this.upperLimit = Number(this.studentData.courseHourShareStudent.upperLimit);
            this.useCourseHour = Number(this.studentData.courseHourShareStudent.usedHours);
            this.courseHourShare = this.upperLimit - this.useCourseHour;
            this.courseHourShareEndTime = this.studentData.courseHourShareStudent.courseHourShare.endTime;
        } else {
            this.upperLimit = 0;
            this.useCourseHour = 0;
            this.courseHourShare = 0;
            this.courseHourShareEndTime = '';
        }
        this.courseHourStage = this.studentData.courseHourStage ? Number(this.studentData.courseHourStage.courseHour) : 0;
        this.courseHourStageEndTime = this.studentData.courseHourStage ? this.studentData.courseHourStage.endTime : '';
        this.allCourseHour = this.courseHour + this.courseHourStage;
        this.feedbackAlert()
    }

    /**
     * 在获取到学生有课程没有评价的时候进行弹框提醒（类似文件调查的回馈表）
     */
    feedbackAlert() {
        if (this.noWriteClassroomData.voList.length>0) {  //如果有一条没有评论，就跳转填写课后问卷的卡片列表页
            this.selectedIndex = '2';
            AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.alertTitle, SettingsService.I18NINFO.swat.alertContent);
        }
    }

    /**
     * 跳转至课堂详情
     * @param classroomCode          课堂编码
     */
    goDetail(classroomCode) {
        this.router.navigate(['/manage/student/detail', classroomCode]);
    }

    /**
     * 跳转至订单详情
     * @param orderNo          订单编码
     */
    goOrderDetail(orderNo) {
        this.router.navigate(['/manage/student/orderDetail', orderNo]);
    }

    /**
     * 跳转到课后评价页面
     *
     */
    goWrite(classroomCode, tutorCode) {
        this.router.navigate(['/manage/student/feedback', classroomCode, tutorCode, this.studentCode]);
    }


    /**
     * 上课记录获取更多
     */
    roomLoadMore() {
        let curentPage=this.endedClassroom.pageSize/9==1?this.endedClassroom.curPage:this.endedClassroom.pageSize/9;
        let curPage = ++curentPage,
            pageSize = this.endedClassroom.pageSize;
        sessionStorage.setItem('stuYeild',String(curPage));
        let roomData = this.student.getEndedClassroom(this.studentCode, curPage, pageSize, this.settings.user.timeZone);
        let voList = this.endedClassroom.voList.concat(roomData.voList);
        this.endedClassroom = new Page(roomData);
        this.endedClassroom.voList = voList;
    }

    /**
     * 问卷调查加载更多
     */
    questionnaireLoadMore(){
        let curentPage=this.noWriteClassroomData.pageSize/9==1?this.noWriteClassroomData.curPage:this.noWriteClassroomData.pageSize/9;
        let curPage = ++curentPage,
            pageSize = this.noWriteClassroomData.pageSize;
        sessionStorage.setItem('stuNo',String(curPage));
        let noWriteData = this.student.getNoWriteClassroom(this.studentCode, curPage, pageSize, this.settings.user.timeZone);
        let voList = this.noWriteClassroomData.voList.concat(noWriteData.voList);
        this.noWriteClassroomData = new Page(noWriteData);
        this.noWriteClassroomData.voList = voList;
    }

    /**
     * 订单记录获取更多
     */
    orderLoadMore() {
        let curentPage=this.orders.pageSize/9==1?this.orders.curPage:this.orders.pageSize/9;
        let curPage = ++curentPage,
            pageSize = this.orders.pageSize;
        sessionStorage.setItem('stuOrder',String(curPage));
        let orderData = this.student.getOrders(this.studentCode, curPage, pageSize, this.settings.user.timeZone);
        let voList = this.orders.voList.concat(orderData.voList);
        this.orders = new Page(orderData);
        this.orders.voList = voList;
    }

}
