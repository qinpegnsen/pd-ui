import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {TutorService} from '../tutor.service';
import {SettingsService} from '../../../core/settings/settings.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {TranslateService} from '@ngx-translate/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {AppComponent} from "../../../app.component";
declare var $: any;

const swal = require('sweetalert');

@Component({
    selector: 'app-course-detail',
    templateUrl: './course-detail.component.html',
    styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
    public stuData: any;              // 问卷调查记录学生填写数据
    public classroomCode: string;       // 课堂编码
    public tutorCode: string;            // 教师编码
    public classroomData: any = {};      // 课堂详情数据
    public log: any = {};             // 课堂日志
    public timelineAlt: boolean = false;
    public feedbackData: any;
    public cancelSubscribe: any;
    public myFeedback: any;
    public studentFeedback: any;           //学生填的问答题
    public attendStudentList: any;
    public attendAndAbsentList: any;
    public tutorFeedBack: any;
    public classroomState: number = SettingsService.enums.classroomState;
    public isAssess: boolean = false;     //课堂是否可以评价
    public levels: Array<any> = new Array();
    public feedbackStudents: Array<any> = new Array(); //未被评论的学生列表
    public selFeedbackStudent: string; //选中的要评论的学员
    public studentCancel: string = SettingsService.studentCancel;
    public modalRef: BsModalRef;
    public starLevel: number = 5;
    public isMobile: boolean = false;
    isReadonly: boolean = true;
    public absnetStudentList: any;        //缺席的学生
    private totalData: any;            //课堂回馈表的所有的数据
    inputMessageAll: string;           //老师群发信息
    messageArrLsit: any = [];                               //留言信息数据

    constructor(public route: ActivatedRoute, private modalService: BsModalService, public router: Router, public tutor: TutorService, public settings: SettingsService, public location: Location, public tools: RzhtoolsService, public sanitizer: DomSanitizer, public translate: TranslateService) {
    }

    ngOnInit() {
        $(document).scrollTop(0);//解决手机端页面不在最顶端的bug
        $('.table-box').scrollLeft($('.table-box')[0].scrollWidth);//解决手机端去上课盒子滚动条不在最右边的问题
        this.classroomCode = this.getClassroomCode();          // 初始化课堂编码
        this.tutorCode = this.settings.user.tutorCode;       // 初始化教师编码
        this.classroomFeedbackStudent(); //获取未被评论的学员列表
        this.updata();
        this.totalData = this.tutor.loadStudentQuestionnaireRecord(this.classroomCode);
        this.getstuData();    // 获取学生填写的课堂回馈记录
        this.browserRedirect();
    }


    /**
     * 跳转到留言板块
     */
    linkToMessage() {
        let offsetTop = $("#message").offset().top;
        $(document).scrollTop(offsetTop);
    }

    /**
     * 获取学生填写的课堂回馈记录
     *
     */
    getstuData() {
        const me = this;
        let stuTotalData: any = {
            questionNaireRecord: new Array(),
            feedbackRecord: new Array()
        };  //存储学生填的问卷信息


        /**
         * 获取学生对老师的问卷信息
         */
        if (this.totalData['classroomStudentses'].length > 0) {
            /**
             * 存储学生填的问卷问题
             */
            for (let i = 0; i < this.totalData['classroomStudentses'].length; i++) {
                if (this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList.length > 0) {
                    for (let j = 0; j < this.totalData['classroomStudentses'][i]['classroomQuestionnaireRecordList'].length; j++) {
                        let obj: any = {
                            questionContent: '',
                            questionStar: '',
                            score: new Array()
                        };
                        obj.questionContent = this.totalData['classroomStudentses'][i]['classroomQuestionnaireRecordList'][j].classroomQuestionnaireContent.questionContent;
                        stuTotalData.questionNaireRecord.push(obj);
                    }
                    break
                }
            }


            /**
             * 学生单独的打分和平均得分和星级还有问答题
             */
            let isFeedBackNum: number = 0;     //填过问卷表的学生
            for (let i = 0; i < this.totalData['classroomStudentses'].length; i++) {
                /**
                 * 学生单独的打分和平均得分
                 */
                if (this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList.length > 0) {
                    isFeedBackNum++;
                    for (let j = 0; j < this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList.length; j++) {
                        let accumulated: number = i > 0 ? this.totalData['classroomStudentses'][i - 1].classroomQuestionnaireRecordList.length > 0 ? this.totalData['classroomStudentses'][i - 1].classroomQuestionnaireRecordList[j].questionStar : 0 : 0;

                        /**
                         * 所有学生的平均得分
                         */
                        stuTotalData.questionNaireRecord[j].questionStar = this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList[j].questionStar + accumulated;
                        if (i == this.totalData['classroomStudentses'].length - 1) {
                            stuTotalData.questionNaireRecord[j].questionStar = stuTotalData.questionNaireRecord[j].questionStar / isFeedBackNum;
                        }

                        /**
                         * 每个学生对应的得分
                         */
                        let obj = {
                            studentName: '',
                            questionStar: ''
                        }, tempArr = new Array();
                        obj.studentName = this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList[j].studentName;
                        obj.questionStar = this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList[j].questionStar;
                        stuTotalData.questionNaireRecord[j].score.push(obj);
                    }
                }
                /**
                 * 星级还有问答题
                 */
                stuTotalData.feedbackRecord.push(this.totalData['classroomStudentses'][i].classroomFeedback)
            }


            /**
             * 存储学生的问答信息
             */
            stuTotalData.feedbackRecord = this.studentFeedback;
        }
        me.stuData = stuTotalData;
    };


    updata() {
        this.classroomData = this.tutor.loadAll(this.classroomCode, this.tutorCode, this.settings.user.timeZone);           // 初始化课堂详情数据
        if (this.classroomData && this.classroomData.classroomCoursewares && this.classroomData.classroomCoursewares.length > 0) { //设置课件列表、时长
            SettingsService.coursewareList = this.classroomData.classroomCoursewares;
            SettingsService.courseDuration = this.classroomData.duration;
        }
        this.feedbackData = this.classroomData.classroomFeedbacks;
        this.attendStudentList = this.getAttendStudents();
        this.absnetStudentList = this.getAbsentStudents();
        this.attendAndAbsentList = this.getAttendAndAbsentStudents();
        this.studentFeedback = this.tools.getObjectOfArreyByKeyAndValue(this.feedbackData, 'feedbackMan', 'Student');
        this.tutorFeedBack = this.tools.getObjectOfArreyByKeyAndValue(this.feedbackData, 'feedbackMan', 'Tutor');
        let traces = this.classroomData.classroomTraces;             // 获取课堂日志
        this.log.Book = RzhtoolsService.getJsonByValue(traces, 'event', 'Book') || RzhtoolsService.getJsonByValue(traces, 'event', 'CustomBook');
        this.log.Confirmed = RzhtoolsService.getJsonByValue(traces, 'event', 'Confirmed');
        this.log.Started = RzhtoolsService.getJsonByValue(traces, 'event', 'Started');
        this.log.Ended = RzhtoolsService.getJsonByValue(traces, 'event', 'Ended');
        this.levels = this.tools.getEnumDataList('1025');
        if (this.classroomData && this.classroomData.courseTimetable) {
            this.isAssess = this.tutor.checkAssess(this.classroomData.courseTimetable.courseCode, this.classroomData.classroomStudentses[0].studentCode, this.classroomData.courseTimetable.tutorCode);
        }
        this.levels.sort((a, b) => {
            return a.val - b.val;
        });

        let result=this.tutor.tutorGetMessage(this.classroomCode,this.tutorCode,this.settings.user.timeZone);
        if(result.length>0){
            this.resetMessage(result);
            setTimeout(() => {
                for (let i = 0; i < $(".messageScoll").length; i++) {
                    $(".messageScoll").scrollTop($(".messageScoll")[i].scrollHeight);//让滚动条一直在最下面
                }
            });
        }
    }

    /**
     * 重组留言数据
     */
    resetMessage(result){
        for(let i=0;i<result.length;i++){
            for(let j=0;j<result[i].messageInfo.length;j++){
                if(result[i].messageInfo[j].sender=='TUTOR'){
                    result[i].messageInfo[j].img=this.classroomData.classroomTutors[0].tutor.avatar;
                }else {
                    for(let k=0;k<this.classroomData.classroomStudentses.length;k++){
                        if(this.classroomData.classroomStudentses[k].studentCode==result[i].messageInfo[j].studentCode){
                            result[i].messageInfo[j].img=this.classroomData.classroomStudentses[k].student.avatar;
                        }
                    }
                }
            }
        }
        this.messageArrLsit=result;
    }

    /**
     * 过滤出出席学生的列表
     */
    getAttendStudents() {
        let arr = new Array();
        if (this.classroomData.classroomStudentses.length > 0) {
            for (let i = 0; i < this.classroomData.classroomStudentses.length; i++) {
                if (this.classroomData.classroomStudentses[i].state == 'Attend') {
                    arr.push(this.classroomData.classroomStudentses[i])
                }
            }
        }
        return arr;
    }

    /**
     * 过滤出缺席学生的列表
     */
    getAbsentStudents() {
        let arr = new Array();
        if (this.classroomData.classroomStudentses.length > 0) {
            for (let i = 0; i < this.classroomData.classroomStudentses.length; i++) {
                if (this.classroomData.classroomStudentses[i].state == 'Absent') {
                    arr.push(this.classroomData.classroomStudentses[i])
                }
            }
        }
        return arr;
    }

    /**
     * 过滤出出席和未出席学生的列表
     */
    getAttendAndAbsentStudents() {
        let arr = new Array();
        if (this.classroomData.classroomStudentses.length > 0) {
            for (let i = 0; i < this.classroomData.classroomStudentses.length; i++) {
                if (this.classroomData.classroomStudentses[i].state == 'Attend' || this.classroomData.classroomStudentses[i].state == 'Absent') {
                    arr.push(this.classroomData.classroomStudentses[i])
                }
            }
        }
        return arr;
    }

    /**
     * 留言提交
     */
    messageSubmit(index, value,code) {
        let me=this;
        for (let i = 0; i < this.messageArrLsit.length; i++) {
            if (i == index) {
                let result=me.tutor.addTutorsMessage(value,me.classroomCode,me.tutorCode,code);
                if(result){
                    $('.inputMessageValue')[index].value = '';
                    let result=this.tutor.tutorGetMessage(this.classroomCode,this.tutorCode,this.settings.user.timeZone);
                    if(result.length>0){
                        this.resetMessage(result);
                    }
                }
            }
        }
        setTimeout(() => {
            $(".messageScoll").scrollTop($(".messageScoll")[index].scrollHeight);//让滚动条一直在最下面
        });
    }


    /**
     * 群发留言
     */
    messageSubmitAll() {
        let me = this;
        let result=me.tutor.addSysMessage(me.inputMessageAll,me.classroomCode);
        if(result){
            me.inputMessageAll = '';
            let result=this.tutor.tutorGetMessage(this.classroomCode,this.tutorCode,this.settings.user.timeZone);
            if(result.length>0){
                this.resetMessage(result);
            }
        }
        setTimeout(() => {
            for (let i = 0; i < $(".messageScoll").length; i++) {
                $(".messageScoll").scrollTop($(".messageScoll")[i].scrollHeight);//让滚动条一直在最下面
            }
        });
    }

    /**
     * 截取字符串并且判断是通已分钟的信息，不是同一分钟的显示时间
     * @param time  当前循环的时间
     * @param arr    数组
     * @param i   当前的下标
     */
    splitStr(time, arr, i) {
        if(i>0){
            if(arr[i-1].createTime.substr(0,16)!=time.substr(0,16)){
                return time.substr(0,16)
            }else{
                return null
            }
        }else{
            return time.substr(0,16)
        }
    }


    /**
     * 判断终端设备
     */
    browserRedirect() {
        let sUserAgent = navigator.userAgent.toLowerCase();
        let bIsIpad = sUserAgent.match(/ipad/i) != null;
        let bIsIphoneOs = sUserAgent.match(/iphone os/i) != null;
        let bIsMidp = sUserAgent.match(/midp/i) != null;
        let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) != null;
        let bIsUc = sUserAgent.match(/ucweb/i) != null;
        let bIsAndroid = sUserAgent.match(/android/i) != null;
        let bIsCE = sUserAgent.match(/windows ce/i) != null;
        let bIsWM = sUserAgent.match(/windows mobile/i) != null;
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            this.isMobile = true;
            swal("", SettingsService.I18NINFO.swat.e253, "warning"); //如果检测到时移动端或者是ipad，让 用户到pc端打开
        }
    }


    /**
     * 获取URL中课堂编码
     * @returns {string}     返回课堂编码
     */
    public getClassroomCode() {
        let code: string;
        this.cancelSubscribe = this.cancelSubscribe = this.route.params.subscribe(params => {
            code = params['code'];
        });
        return code;
    }

    /**
     * 返回上一页
     */
    goBack() {
        this.location.back();
    }

    /**
     * 弹框提示上课须知
     */
    notice() {
        swal({
            title: SettingsService.I18NINFO.swat.goToClassForTutor.title,
            text: `<hr/>
					<p  style="text-align: left; padding-left: 10%; font-size: 14px; line-height: 2em">` + SettingsService.I18NINFO.swat.goToClassForTutor.textOne + `</p>
					<p style="text-align: left; padding-left: 10%; font-size: 14px; line-height: 2em">` + SettingsService.I18NINFO.swat.goToClassForTutor.textTwo + `</p>
					<p style="text-align: left; padding-left: 10%; font-size: 14px; line-height: 2em">` + SettingsService.I18NINFO.swat.goToClassForTutor.textThree + `</p>
					<hr/>`,
            html: true
        });
    }

    /**
     * 教师提交评论
     * @param msg      评论内容
     */
    leaveMsg(msg: any) {
        let me = this;
        if (!msg.value) {
            AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e254);
        } else {
            if (me.selFeedbackStudent) {
                me.tutor.leaveMsg(me.classroomCode, me.tutorCode, me.selFeedbackStudent, msg.value, me.starLevel, res => {
                    me.updata();
                    me.selFeedbackStudent = null; //重置选择的需要评论的学员
                    me.classroomFeedbackStudent(); //刷新待评论学员
                });
            } else {
                swal(SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e103, "error");
            }
            me.modalRef.hide();
        }
    }

    /**
     * 查看课件内容
     */
    courseware(courseware: any) {
        let _this = this;
        SettingsService.selCourseware = courseware; //所选课件信息
        // _this.router.navigate(["/papers/courseware"], {queryParams: {code: _this.classroomCode}})
        let browserLang = _this.translate.getBrowserLang();
        let lang = SettingsService.selectLanguage || browserLang;
        // window.open("/#/papers/courseware?code=" + _this.classroomCode + '&lang=' + lang);
        window.location.href = "/#/papers/courseware?code=" + _this.classroomCode + '&lang=' + lang;   //因为是单页应用，在新的窗口打开的时候，如果再去获取服务里面的值都会是空的
    }

    /**
     * 给学生评级
     * @param data    学生评级数据
     */
    assess(data) {
        let me = this;
        if (data.valid) {
            me.tutor.assess(this.classroomData.classroomStudentses[0].studentCode, data.value.chineseLevel, data.value.assessmentSummary, res => {
                this.updata();
            });
        }
    }

    /**
     * 获取未被评论的学员列表
     */
    classroomFeedbackStudent() {
        let me = this;
        me.feedbackStudents = me.tutor.classroomFeedbackStudent(me.classroomCode);
    }

    /**
     * 老师去上课
     */
    start() {
        this.tutor.startClassroom(this.classroomCode, this.tutorCode, res => {
            if (res.success) {
                window.open(res.data);
            } else {
                this.classroomData = this.tutor.loadAll(this.classroomCode, this.tutorCode, this.settings.user.timeZone);
            }
            ;
        });
    }


    /**
     * 跳转到老师对学生的问卷调查页面
     * @param code
     * @param studentName
     */
    openBox(code) {
        this.router.navigate(['/manage/tutor/feedback', this.classroomCode, this.tutorCode, code])
        // this.modalRef = this.modalService.show(template);
        // this.selFeedbackStudent = code;
    }

    ngOnDestroy() {
        this.cancelSubscribe.unsubscribe()
    }


}
