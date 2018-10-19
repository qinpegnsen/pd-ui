import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {CookieService} from "angular2-cookie/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {StudentService} from "../../student/student.service";
import {TutorService} from "../tutor.service";
const swal = require('sweetalert');
@Component({
    selector: 'app-feedback-list',
    templateUrl: './feedback-list.component.html',
    styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit, OnDestroy {
    public getquestionnairData: any;    //问卷调查表的数据
    public classroomCode: any;    //课堂编码
    public tutorCode: any;    //教师编码
    public studentCode: any;    //学生编码
    public templetCode: any;    //模板编码
    public schedule: any;       //课程进度
    public feedback: any;       //学生需要改进的地方
    public remark: any;       //其他
    public cancelSubscribe: any;       //取消订阅
    public bol: boolean = false;       //提交的开关，让只能点击一次

    constructor(public router: ActivatedRoute, public setting: SettingsService, public location: Location, public tutor: TutorService) {
    }

    ngOnInit() {
        this.classroomCode = this.getorderCode('classroomCode');
        this.getquestionnairData = this.tutor.getquestionnair(this.classroomCode)['classroomQuestionnaireSubjectList'];
        this.templetCode = this.getquestionnairData[0].templetCode;
        this.tutorCode = this.getorderCode('tutorCode');
        this.studentCode = this.getorderCode('studentCode');
    }

    /**
     * 获取URL编码
     * @returns {string}     返回编码
     */
    public getorderCode(val) {
        let code: string;
        this.cancelSubscribe = this.router.params.subscribe(params => {
            code = params[val];
        });
        return code;
    };

    /**
     * 提交问卷调查
     * @param fromData
     */
    submitAnswer(result) {
        this.bol = true;
        let arr = new Array();
        for (let i in result.value) {
            let obj = {};
            obj['questionCode'] = i;
            if (result.value[i]) {
                obj['questionStar'] = result.value[i].replace(/[\r\n]/g, "");
            }
            arr.push(obj)
        }
        let data = {
            classroomCode: this.classroomCode,
            tutorCode: this.tutorCode,
            studentCode: this.studentCode,
            feedbackMan: 'Tutor',
            starLevel: '5',
            questionnaireRecordVOList: JSON.stringify(arr),
            templetCode: this.templetCode
        };
        let obj = this.tutor.recordQuestionnair(data);
        if (obj) {
            this.bol = false;
        }

    }

    ngOnDestroy() {
        this.cancelSubscribe.unsubscribe()
    }
}
