import { Component, OnInit } from '@angular/core';
import { TutorService } from '../tutor.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { Router } from '@angular/router';
import {AppComponent} from "../../../app.component";

const swal = require('sweetalert');

@Component({
    selector: 'app-tutor-center',
    templateUrl: './tutor-center.component.html',
    styleUrls: ['./tutor-center.component.css']
})
export class TutorCenterComponent implements OnInit {

    public tutorCode: string;               // 教师编码
    public BookClassroom: any = {};           // 预约课堂数据
    public ConfirmClassroom: any = {};        // 待上课课堂数据
    public confirmedBl: boolean = true;           // 预约同意控制器（避免重复操作）
    public custom: string = SettingsService.custom; //自定义预约类型

    constructor(public tutor: TutorService, public settings: SettingsService, public router: Router) {
    }

    ngOnInit() {
        let _this = this;
        _this.tutorCode = _this.settings.user.tutorCode;         // 初始化教师编码
        _this.BookClassroom = _this.tutor.getBookClassroom(_this.tutorCode, _this.settings.user.timeZone);            // 初始化预约课堂数据
        _this.resetData();
        _this.ConfirmClassroom = _this.tutor.getConfirmClassroom(_this.tutorCode, _this.settings.user.timeZone);          // 初始化待上课课堂数据
    }

    /**
     *重组课堂预约的数据
     */
    resetData(){
        for(let i=0;i<this.BookClassroom.classrooms.length;i++){
            this.BookClassroom.classrooms[i].studentCode=this.BookClassroom.classrooms[i].classroomStudentses[0].studentCode  //每个卡片只有一个学生
        }
    }

    /**
     * 获取相对应的留言信息
     * @param classroomLeavemessages
     * @param studentCode
     * @returns {any}
     */
    getBol(classroomLeavemessages,studentCode){
        let obj:any;
        for(let i=0;i<classroomLeavemessages.length;i++){
            if(classroomLeavemessages[i].studentCode==studentCode){
                obj=classroomLeavemessages[i];
                break
            }
        }
        return obj;
    }


    /**
     * 跳转至课堂详情
     * @param classroomCode         课堂编码
     */
    goDetail(classroomCode) {
        this.router.navigate(['/manage/tutor/detail', classroomCode]);
    }

    /**
     * 教师同意预约课程
     * @param studentses    学生编码
     * @param classroomCode    课堂编码
     */
    confirmed(studentses, classroomCode, isCustom: boolean) {
        let me = this;
        if (me.confirmedBl == true) {
            swal({
                title: SettingsService.I18NINFO.swat.e231,
                text: SettingsService.I18NINFO.swat.e232,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "rgb(50,168,182)",
                confirmButtonText: SettingsService.I18NINFO.swat.e121,
                cancelButtonText: SettingsService.I18NINFO.swat.e122,
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
                function () {
                    me.confirmedBl = false;
                    me.tutor.confirmed(me.tutorCode, studentses[0].studentCode, classroomCode, isCustom, res => {
                        if (res.success) {
                            AppComponent.rzhAlt('success',SettingsService.I18NINFO.swat.e101);
                            swal.close();
                            me.BookClassroom = me.tutor.getBookClassroom(me.tutorCode, me.settings.user.timeZone);
                            me.resetData();
                            me.ConfirmClassroom = me.tutor.getConfirmClassroom(me.tutorCode, me.settings.user.timeZone);
                        } else {
                            AppComponent.rzhAlt('error',SettingsService.I18NINFO.swat.e102);
                        }
                        me.confirmedBl = true;
                    });
                });
        }
    }

    /**
     * 教师不同意预约课程
     * @param studentses      学生对象
     * @param classroomCode       课堂编码
     */
    cancelOrder(studentses, classroomCode, isCustom: boolean) {
        let me = this;
        if (me.confirmedBl == true) {
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
                    me.confirmedBl = false;
                    me.tutor.cancelOrder(me.tutorCode, studentses[0].studentCode, classroomCode, isCustom, res => {
                        if (res.success) {
                            AppComponent.rzhAlt('success',SettingsService.I18NINFO.swat.e101);
                            swal.close();
                            me.BookClassroom = me.tutor.getBookClassroom(me.tutorCode, me.settings.user.timeZone);
                            me.resetData();
                            me.ConfirmClassroom = me.tutor.getConfirmClassroom(me.tutorCode, me.settings.user.timeZone);
                        } else {
                            AppComponent.rzhAlt('error',SettingsService.I18NINFO.swat.e102);
                        }
                        me.confirmedBl = true;
                    });
                });
        }
    };

    /**
     * 查看学生的评论信息
     */
    lookComment(studentCode) {
        this.router.navigate(['/manage/tutor/comment', studentCode]);
    }
}
