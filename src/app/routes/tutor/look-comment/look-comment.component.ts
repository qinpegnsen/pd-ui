import { Page } from './../../../core/page/page';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {TutorService} from "../../tutor/tutor.service";
import {StudentService} from "../../student/student.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {SearchService} from "../../search/search.service";
const swat = require("sweetalert");

@Component({
    selector: 'app-look-comment',
    templateUrl: './look-comment.component.html',
    styleUrls: ['./look-comment.component.css']
})
export class LookCommentComponent implements OnInit,OnDestroy {
    studentData: any; //学生信息
    public isFavorite: boolean = false;
    public studentCode: string; //学生code
    public feedbackData: any; //老师对学生评价列表数据
    public page:any; //老师对学生评价分页
    public cancelSubscribe:any;

    constructor(public location: Location, public settings: SettingsService, public route: ActivatedRoute,public tutorService: TutorService) {
    }

    ngOnInit() {
        let _this = this;
        _this.studentCode=_this.getClassroomCode();
        _this.studentData = _this.tutorService.loadForStu(_this.studentCode);
        _this.page=_this.tutorService.getFeedback(_this.studentCode);
        _this.feedbackData=_this.page.voList;
    }

    /**
     * 返回上一页
     */
    toBack() {
        this.location.back();
    }

    /**
     * 获取URL中课堂编码
     * @returns {string}     返回课堂编码
     */
    public getClassroomCode() {
        let code: string;
        this.cancelSubscribe=this.route.params.subscribe(params => {
            code = params['code'];
        });
        return code;
    }

    /**
     * 加载下一页
     */
    loadMore() {
        let curPage = this.page.curPage + 1; //加载下一页内容
        let result=this.tutorService.getFeedback(this.studentCode,curPage);
        this.page=result;
        this.feedbackData=this.feedbackData.concat(result.voList||[]);
    }

    ngOnDestroy(){
        this.cancelSubscribe.unsubscribe()
    }
}
