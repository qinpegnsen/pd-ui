import {Component, OnInit} from '@angular/core';
import {TutorService} from '../tutor.service';
import {SettingsService} from '../../../core/settings/settings.service';
import {Router} from '@angular/router';
import {AppComponent} from "../../../app.component";
import {Page} from "../../../core/page/page";

const swal = require('sweetalert');

@Component({
    selector: 'app-order-handle',
    templateUrl: './order-handle.component.html',
    styleUrls: ['./order-handle.component.css']
})
export class OrderHandleComponent implements OnInit {

    public tutorCode: string;        // 教师编码
    public classroomData: any = {};      // 预约课堂数据
    public cancelClassroomList: Array<any> = new Array();      // 被取消预约课堂数据
    public cancelClassroomPage: Page;      // 被取消预约课堂数据
    public custom: string = SettingsService.custom; //自定义预约类型
    curPage: number = 1; //当前页
    pageSize: number = 12; //每页条数

    constructor(public tutor: TutorService, public settings: SettingsService, public router: Router) {
    }

    ngOnInit() {
        let _this = this;
        _this.tutorCode = _this.settings.user.tutorCode;              // 初始化教师编码
        _this.classroomData = _this.tutor.getBookClassroom(_this.tutorCode, _this.settings.user.timeZone);         // 初始化预约课堂数据
        _this.resetData();
        _this.removeStudentAndMsg();
        _this.cancelClassroomPage = _this.tutor.cancelClassroom(_this.curPage, _this.pageSize, _this.tutorCode, _this.settings.user.timeZone); //获取已被取消的信息列表
        _this.cancelClassroomList = _this.cancelClassroomPage.voList;
    }

    /**
     * 获取相对应的留言信息
     * @param classroomLeavemessages
     * @param studentCode
     * @returns {any}
     */
    getBol(classroomLeavemessages, studentCode) {
        let obj: any;
        for (let i = 0; i < classroomLeavemessages.length; i++) {
            if (classroomLeavemessages[i].studentCode == studentCode) {
                obj = classroomLeavemessages[i];
                break
            }
        }
        return obj;
    }

    /**
     *重组课堂预约的数据
     */
    resetData() {
        let me = this;
        for (let i = 0; i < me.classroomData.classrooms.length; i++) {
            me.classroomData.classrooms[i].studentCode = me.classroomData.classrooms[i].classroomStudentses[0].studentCode  //每个卡片只有一个学生
        }
    }

    // /**
    //  * 查看更多（评论）
    //  * @param classroomCode
    //  */
    // lookComment(classroomCode) {
    //     this.router.navigate(['/manage/tutor/comment', classroomCode]);
    // }

    /**
     * 剔除处于取消状态的学员及留言
     */
    removeStudentAndMsg() {
        let _this = this;
        if (_this.classroomData && _this.classroomData.classrooms) {
            let classrooms: Array<any> = _this.classroomData.classrooms, students: Array<any>, msgList: Array<any>;
            classrooms.forEach(ret => {
                students = ret.classroomStudentses;
                msgList = ret.classroomLeavemessages;
                if (students && students.length > 0) { //剔除已取消预约的学员信息
                    students.forEach((student, index) => {
                        if (student.state == SettingsService.studentCancel) students.splice(index, 1);
                    })
                }
                if (msgList && msgList.length > 0) {//剔除已取消预约的学员的留言信息
                    msgList.forEach((msg, index) => {
                        if (msg.classroomStudents.state == SettingsService.studentCancel) msgList.splice(index, 1);
                    })
                }
            })
        }
    }

    /**
     * 教师同意预约课程
     * @param studentses      学生对象
     * @param classroomCode       课堂编码
     */
    confirmed(studentses, classroomCode, isCustom: boolean) {
        let me = this;

        swal({
                title: SettingsService.I18NINFO.swat.e231,
                text: SettingsService.I18NINFO.swat.e232,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "rgb(50,168,182)",
                confirmButtonText: SettingsService.I18NINFO.swat.e121,
                cancelButtonText: SettingsService.I18NINFO.swat.e122,
                showLoaderOnConfirm: true,                       //解决多次同意的问题
                closeOnConfirm: false
            },
            function () {

                me.tutor.confirmed(me.tutorCode, studentses[0].studentCode, classroomCode, isCustom, res => {
                    if (res.success) {
                        AppComponent.rzhAlt('success', SettingsService.I18NINFO.swat.e234);
                        swal.close();
                        me.classroomData = me.tutor.getBookClassroom(me.tutorCode, me.settings.user.timeZone);
                        me.resetData();
                    } else {
                        AppComponent.rzhAlt('error', SettingsService.I18NINFO.swat.e238);
                    }
                });
            });
        ;

    };

    /**
     * 教师不同意预约课程
     * @param studentses      学生对象
     * @param classroomCode       课堂编码
     */
    cancelOrder(studentses, classroomCode, isCustom: boolean) {
        let me = this;
            swal({
                    title: SettingsService.I18NINFO.swat.e256,
                    text: SettingsService.I18NINFO.swat.e257,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "rgb(50,168,182)",
                    confirmButtonText: SettingsService.I18NINFO.swat.e121,
                    cancelButtonText: SettingsService.I18NINFO.swat.e122,
                    showLoaderOnConfirm: true,
                    closeOnConfirm: false
                },
                function () {
                    me.tutor.cancelOrder(me.tutorCode, studentses[0].studentCode, classroomCode, isCustom, res => {
                        if (res.success) {
                            AppComponent.rzhAlt('success', SettingsService.I18NINFO.swat.e101);
                            swal.close();
                            me.classroomData = me.tutor.getBookClassroom(me.tutorCode, me.settings.user.timeZone);
                            me.cancelClassroomPage = me.tutor.cancelClassroom(1, me.pageSize, me.tutorCode, me.settings.user.timeZone); //获取已被取消的信息列表
                            me.cancelClassroomList = me.cancelClassroomPage.voList;
                            me.resetData();
                        } else {
                            AppComponent.rzhAlt('error', SettingsService.I18NINFO.swat.e238);
                        }
                    });
                });
            ;

    };


    /**
     * 取消列表获取更多
     */
    orderLoadMore() {
        let _this = this;
        let volist = _this.cancelClassroomList;
        _this.cancelClassroomPage = _this.tutor.cancelClassroom(++_this.curPage, _this.pageSize, _this.tutorCode, _this.settings.user.timeZone); //获取已被取消的信息列表
        let result = volist.concat(_this.cancelClassroomPage.voList);
        _this.cancelClassroomList = result;
    }

    /**
     *对留言记录进行分析，如果没有浏览记录也要增加一条文字，防止页面错乱
     * @param value
     */
    getLeaveMsg(arr, code) {
        let result = false;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].studentCode == code) {
                result = true;
                break;
            }
        }
        return result
    }
}
