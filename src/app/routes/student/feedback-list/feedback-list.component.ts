import {Component, OnDestroy, OnInit} from '@angular/core';
import {StudentService} from "../student.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {CookieService} from "angular2-cookie/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {getContentOfKeyLiteral} from "@angular/cli/lib/ast-tools";
import {formatDate} from "ngx-bootstrap/bs-moment/format";
import {isNullOrUndefined, isNumber} from "util";
import {AppComponent} from "../../../app.component";
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
    public starLevel: number;    //默认星级
    public subjectCode: any;       //主题编码
    public starCode: any;       //打星编码
    public cancelSubscribe: any;
    public bol: boolean = false;       //提交的开关，让只能点击

    constructor(public student: StudentService, public settings: SettingsService, public router: ActivatedRoute, public location: Location) {
    }

    ngOnInit() {
        this.classroomCode = this.getorderCode('classroomCode');
        this.getquestionnairData = this.student.getquestionnair(this.classroomCode)['classroomQuestionnaireSubjectList'][0]['classroomQuestionnaireContentList'];
        this.templetCode = this.getquestionnairData[0].templetCode;
        this.subjectCode = this.getquestionnairData[0]['subjectCode'];
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
        if (isNullOrUndefined(this.starLevel)) {
            AppComponent.rzhAlt('info', SettingsService.I18NINFO.swat.evaluate);
            this.bol = false;
        } else {
            for (let i in result.value) {
                // if (i == 'starLevel') {
                //     continue;
                // }
                let obj = {};
                obj['questionCode'] = i;
                if (isNumber(result.value[i])) {
                    obj['questionStar'] = result.value[i]
                } else {
                    obj['questionStar'] = result.value[i].replace(/[\r\n]/g, "");
                }
                arr.push(obj)
            }
            let data = {
                classroomCode: this.classroomCode,
                tutorCode: this.tutorCode,
                studentCode: this.studentCode,
                feedbackMan: 'Student',
                starLevel: this.starLevel,
                questionnaireRecordVOList: JSON.stringify(arr),
                templetCode: this.templetCode
            };
            let obj = this.student.recordQuestionnair(data);
            if (obj) {
                this.bol = false;
            }
        }
    }

    ngOnDestroy() {
        this.cancelSubscribe.unsubscribe();
    }
}
