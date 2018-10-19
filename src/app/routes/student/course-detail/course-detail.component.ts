import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../core/settings/settings.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {StudentService} from '../student.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {OrderService} from "../../order/order.service";
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {isNullOrUndefined} from "util";
import {AppComponent} from "../../../app.component";
declare var $: any;

const swal = require('sweetalert');

@Component({
    selector: 'app-course-detail',
    templateUrl: './course-detail.component.html',
    styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
    public classroomCode: string;        // 课堂编码
    public studentCode: string;          // 学生编码
    public classroomData: any = {};      // 课堂详情数据
    public log: any = {};                 // 日志对象
    public timelineAlt: boolean = false;
    public tutorCode: string;
    public feedbackData: any;
    public myFeedback: any;
    public myLeavemessages: any;
    public studentFeedback: any;
    public tutorFeedBack: any;
    public attendStudentList: any;        //出席的学生
    public absnetStudentList: any;        //缺席的学生
    public classroomState: number = SettingsService.enums.classroomState;
    public attend: string = SettingsService.attend;
    public custom: string = SettingsService.custom;
    public studentCancel: string = SettingsService.studentCancel;
    public studentBook: string = SettingsService.studentBook;
    public overdue: string = SettingsService.overdue; //预约课程过期未处理状态
    public modalRef: BsModalRef;
    public starLevel: number = 5;
    public isMobile: boolean = false;
    isReadonly: boolean = true;
    cancelSubscribe: any;
    studentState: any;            //当前学生的状态
    // public totalData: any;            //课堂回馈表的所有的数据
    public tutorData: any;            // 问卷调查记录老师填写数据
    inputMessage: string;              //学生点击时候输入的信息
    messageArr: any = [];                               //留言信息数据

    constructor(public route: ActivatedRoute, private modalService: BsModalService, public router: Router, public student: StudentService, public settings: SettingsService, public location: Location, public tools: RzhtoolsService, public  sanitizer: DomSanitizer, public orderService: OrderService) {
    }

    ngOnInit() {
        $(document).scrollTop(0);//解决手机端页面不在最顶端的bug
        $('.table-box').scrollLeft($('.table-box')[0].scrollWidth);//解决手机端去上课盒子滚动条不在最右边的问题
        this.classroomCode = this.getClassroomCode();                 // 初始化课堂编码
        this.studentCode = this.settings.user.studentCode;            // 初始化学生编码
        this.updata();
        this.browserRedirect();
        // this.totalData = this.student.loadStudentQuestionnaireRecord(this.classroomCode);
        // this.getTutorData();    // 获取老师填写的课堂回馈记录
    }

    /**
     * 跳转到留言板块
     */
    linkToMessage() {
        let offsetTop = $("#message").offset().top;
        $(document).scrollTop(offsetTop);
    }


    /**
     * 留言提交
     */
    messageSubmit() {
        let me = this;
        let result=me.student.addStuMessage(me.inputMessage,me.classroomCode,me.tutorCode,me.studentCode);
        if(result){
            me.inputMessage = '';
            let message=me.student.stuGetMessage(this.classroomCode,this.studentCode,me.settings.user.timeZone);
            if(message.length>0){
                this.resetMessage(message);
            }
        }
        setTimeout(() => {
            $(".messageScoll").scrollTop($(".messageScoll")[0].scrollHeight);//让滚动条一直在最下面
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
     * 获取或更新数据
     */
    updata() {
        this.classroomData = this.student.loadAll(this.classroomCode, this.studentCode, this.settings.user.timeZone);      // 初始化课堂详情信息
        this.checkStuState();
        this.tutorCode = this.classroomData.classroomTutors[0].tutor.tutorCode;
        this.feedbackData = this.classroomData.classroomFeedbacks;
        this.attendStudentList = this.getAttendStudents();
        this.absnetStudentList = this.getAbsentStudents();
        let studentFeedbacks = this.tools.getObjectOfArreyByKeyAndValue(this.feedbackData, 'feedbackMan', 'Student');
        this.myFeedback = this.tools.getObjectOfArreyByKeyAndValue(studentFeedbacks, 'studentCode', this.studentCode);
        this.myLeavemessages = this.tools.getObjectOfArreyByKeyAndValue(this.classroomData.classroomLeavemessages, 'studentCode', this.studentCode);
        let tutorFeedBacks = this.tools.getObjectOfArreyByKeyAndValue(this.feedbackData, 'feedbackMan', 'Tutor');
        this.tutorFeedBack = this.tools.getObjectOfArreyByKeyAndValue(tutorFeedBacks, 'studentCode', this.studentCode);
        let traces = this.classroomData.classroomTraces;                             // 获取课堂日志
        // 获取对应状态日志
        this.log.Book = RzhtoolsService.getJsonByValue(traces, 'event', 'Book')
            || RzhtoolsService.getJsonByValue(traces, 'event', 'CustomBook');
        this.log.Confirmed = RzhtoolsService.getJsonByValue(traces, 'event', 'Confirmed');
        this.log.Started = RzhtoolsService.getJsonByValue(traces, 'event', 'Started');
        this.log.Ended = RzhtoolsService.getJsonByValue(traces, 'event', 'Ended');
        let result=this.student.stuGetMessage(this.classroomCode,this.studentCode,this.settings.user.timeZone);
        if(result.length>0){
            this.resetMessage(result);
            setTimeout(() => {
                $(".messageScoll").scrollTop($(".messageScoll")[0].scrollHeight);//让滚动条一直在最下面
            });
        }
    }

    /**
     * 重组留言数据
     */
    resetMessage(result){
        for(let i=0;i<result.length;i++){
            if(result[i].sender=='TUTOR'){
                result[i].img=this.classroomData.classroomTutors[0].tutor.avatar;
            }else {
                result[i].img=this.settings.user.avatar;
            }
        }
        this.messageArr=result;
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
     * 获取老师填写的课堂回馈记录
     *
     */
    // getTutorData() {
    //     const me = this;
    //
    //     let tutorData: any = {
    //         questionNaireRecord: new Array(),
    //         feedbackRecord: new Array()
    //     };  //存储学生填的问卷信息
    //
    //
    //     /**
    //      * 进行数据重组，每个学生问卷记录分开(因为老师之是一个，所以这里用的是0)
    //      */
    //     if (me.totalData['classroomTutors'].length > 0) {
    //         for (let i = 0; i < me.totalData['classroomTutors'][0].classroomFeedbackList.length; i++) {
    //             for (let j = 0; j < me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList.length; j++) {
    //                 let tempArr = new Array();
    //                 if (me.totalData['classroomTutors'][0].classroomFeedbackList[i].studentCode == me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList[j].studentCode) {
    //                     if (!isNullOrUndefined(me.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList)) {
    //                         me.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList.push(me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList[j])
    //                     } else {
    //                         tempArr.push(me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList[j]);
    //                         me.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList = tempArr;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //
    //
    //     /**
    //      * 存储老师填的问卷问题
    //      */
    //     if (this.totalData['classroomTutors'][0]['classroomFeedbackList'].length > 0) {
    //         for (let j = 0; j < this.totalData['classroomTutors'][0]['classroomFeedbackList'][0]['questionnaireRecordList'].length; j++) {
    //             let obj: any = {
    //                 questionContent: '',
    //                 questionStar: '',
    //                 score: new Array()
    //             };
    //             obj.questionContent = this.totalData['classroomTutors'][0]['classroomFeedbackList'][0]['questionnaireRecordList'][j].classroomQuestionnaireContent.questionContent;
    //             tutorData.questionNaireRecord.push(obj);
    //         }
    //     }
    //
    //
    //     /**
    //      * 老师单独的打分和平均得分和星级还有问答题
    //      */
    //     for (let i = 0; i < this.totalData['classroomTutors'][0].classroomFeedbackList.length; i++) {
    //         /**
    //          * 老师单独的打分和平均得分
    //          */
    //         if (this.totalData['classroomTutors'][0].classroomFeedbackList.length > 0) {
    //             for (let j = 0; j < this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList.length; j++) {
    //                 let accumulated: number = i > 0 ? this.totalData['classroomTutors'][0].classroomFeedbackList[i - 1].questionnaireRecordList.length > 0 ? this.totalData['classroomTutors'][0].classroomFeedbackList[i - 1].questionnaireRecordList[j].questionStar : 0 : 0;
    //
    //                 // /**
    //                 //  * 所有学生的平均得分
    //                 //  */
    //                 tutorData.questionNaireRecord[j].questionStar = this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList[j].questionStar + accumulated;
    //                 if (i == this.totalData['classroomTutors'][0].classroomFeedbackList.length - 1) {
    //                     tutorData.questionNaireRecord[j].questionStar = tutorData.questionNaireRecord[j].questionStar / this.totalData['classroomTutors'][0].classroomFeedbackList.length;
    //                 }
    //
    //                 /**
    //                  * 每个学生对应的得分
    //                  */
    //                 let obj = {
    //                     studentName: '',
    //                     questionStar: '',
    //                     studentCode: ''
    //                 }, tempArr = new Array();
    //                 obj.studentName = this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList[j].studentName;
    //                 obj.questionStar = this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList[j].questionStar;
    //                 obj.studentCode = this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList[j].studentCode;
    //                 tutorData.questionNaireRecord[j].score.push(obj);
    //             }
    //         }
    //         /**
    //          * 星级还有问答题
    //          */
    //         tutorData.feedbackRecord.push(this.totalData['classroomTutors'][0].classroomFeedbackList[i])
    //     }
    //     me.tutorData = tutorData;
    // };

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
     * 检测学生的状态，如果未出席，去掉去评论的按钮
     */
    checkStuState() {
        for (let i = 0; i < this.classroomData.classroomStudentses.length; i++) {
            if (this.classroomData.classroomStudentses[i].studentCode == this.studentCode) {
                this.studentState = this.classroomData.classroomStudentses[i].state;
                break;
            }
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
        this.cancelSubscribe = this.route.params.subscribe(params => {
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
     * 到zoom课堂进行上课
     */
    goZoom(zoom, url, classroomCode) {
        // if ( this.isMobile) {
        // 	swal("" , SettingsService.I18NINFO.swat.e253, "warning"); //如果检测到时移动端或者是ipad，让 用户到pc端打开
        // }else {
        window.open(zoom && url);
        this.student.modifyStuState(classroomCode, this.settings.user.studentCode);//更改学生的状态
        // }
    }

    /**
     * 弹框提示上课须知
     */
    notice() {
        swal({
            title: SettingsService.I18NINFO.swat.goToClass.title,
            text: `<hr/>
					<p  style="text-align: left; padding-left: 10%; font-size: 14px; line-height: 2em">` + SettingsService.I18NINFO.swat.goToClass.textOne + `</p>
					<p style="text-align: left; padding-left: 10%; font-size: 14px; line-height: 2em">` + SettingsService.I18NINFO.swat.goToClass.textTwo + `</p>
					<p style="text-align: left; padding-left: 10%; font-size: 14px; line-height: 2em">` + SettingsService.I18NINFO.swat.goToClass.textThree + `</p>
					<hr/>`,
            html: true
        });
    }

    /**
     * 学生提交评论
     * @param msg         评论内容
     */
    leaveMsg(msg) {
        let me = this;
        if (!msg.value) {
            AppComponent.rzhAlt("info", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e254);
        } else {
            me.student.leaveMsg(this.classroomCode, this.studentCode, this.tutorCode, msg.value, me.starLevel, res => {
                this.updata();
            });
            me.modalRef.hide();
        }
    }

    /**
     * 取消预约
     * @param classroomCode 课堂编码
     */
    cancelOrder() {
        let _this = this, ret: any;
        swal({
                title: SettingsService.I18NINFO.swat.e235,
                type: 'info',
                text: SettingsService.I18NINFO.swat.e236,
                confirmButtonText: SettingsService.I18NINFO.swat.e121, //‘确认’按钮命名
                showCancelButton: true, //显示‘取消’按钮
                cancelButtonText: SettingsService.I18NINFO.swat.e122, //‘取消’按钮命名
                animation: 'slide-from-top', //头部滑下来
                closeOnConfirm: false  //点击‘确认’后，执行另外一个提示框
            },
            function () {  //点击‘确认’时执行
                ret = _this.orderService.cancelOrder(_this.studentCode, _this.classroomCode);
                if (ret && ret.success) {
                    swal.close();
                    AppComponent.rzhAlt('success', SettingsService.I18NINFO.swat.e101);
                    _this.router.navigate([SettingsService.studentIndex]); //去用户中心页面
                } else {
                    if (ret.data.code == 4004) {
                        AppComponent.rzhAlt('info', SettingsService.I18NINFO.swat.e237);
                    } else {
                        AppComponent.rzhAlt('info', SettingsService.I18NINFO.swat.e104);
                    }
                }
            }
        )
    }

    /**
     * 跳转到问卷调查页面
     */
    openBox() {
        this.router.navigate(['/manage/student/feedback', this.classroomCode, this.tutorCode, this.studentCode])
    }

    ngOnDestroy() {
        this.cancelSubscribe.unsubscribe()
    }


}
