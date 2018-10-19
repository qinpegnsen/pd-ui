import {Injectable} from '@angular/core';
import {AjaxService} from '../../core/services/ajax.service';
import {Page} from "../../core/page/page";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {isNullOrUndefined} from "util";
import {SettingsService} from "../../core/settings/settings.service";
import {Location} from '@angular/common';
import {AppComponent} from "../../app.component";
import {de} from "ngx-bootstrap/locale";
const swat = require('sweetalert');      // 引入sweetalert

@Injectable()
export class StudentService {
    selectTutorList: Array<any> = new Array(); //自定义课程需求时，选择接受需求的老师列表

    constructor(public ajax: AjaxService, public tools: RzhtoolsService,public location: Location) {
    }

    /**
     * 获取学生详情
     * @param {string} code                   学生编码
     * @returns {{}}                          返回学生数据
     */
    getDetail(code: string) {
        let me = this, result = {};
        me.ajax.get({
            url: '/student/load/detail',
            data: {studentCode: code},
            async: false,
            success: res => {
                res.success ? result = res.data || {} : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    };

    /**
     * 获取问卷调查表
     *
     * @returns {{}}                          返回调查表数据
     */
    getquestionnair(classroomCode) {
        let me = this, result = {};
        me.ajax.get({
            url: '/classroomQuestionnaireTemplet/questionnaireContentList',
            async: false,
            data:{
                // classroomCode:classroomCode,
                feedbackMan:'Student'
            },
            success: res => {
                res.success ? result = res.data || {} : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    };

    /**
     * 记录问卷调查表
     *
     * @returns {{}}                          返回调查表数据
     */
    recordQuestionnair(data) {
        let me = this, result = {};
        me.ajax.get({
            url: '/classroomQuestionnaireRecord/addFeedbackRecord',
            async: false,
            data:data,
            success: res => {
                if( res.success){
                    AppComponent.rzhAlt('info',SettingsService.I18NINFO.swat.submitSuccess);
                    me.location.back();
                }else{
                    AppComponent.rzhAlt('info',SettingsService.I18NINFO.swat.submitError);
                }
                result=res.data;
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    };

    /**
     * 修改学生状态为出席
     * @param {string} studentCode                   学生编码
     * @returns {{}}   classroomCode                 课堂编码
     */
    modifyStuState(classroomCode: string, studentCode: string) {
        let me = this, result = {};
        me.ajax.put({
            url: '/classroom/modifyStudentState',
            data: {
                studentCode: studentCode,
                classroomCode: classroomCode,
            },
            async: false,
            success: res => {
            },
            error: res => {
            }
        });
        return result;
    };

    /**
     * 获取学生收藏教师列表
     * @param {string} studentCode              学生编码
     * @param {number} curPage                  当前页
     * @param {number} pageSize                 分页大小
     * @returns {{}}                            返回收藏老师数据对象
     */
    getfavorite(studentCode: string, curPage: number, pageSize: number) {
        let me = this, result = {};
        me.ajax.get({
            url: '/student/favorite/list',
            data: {studentCode: studentCode, curPage: curPage, pageSize: pageSize},
            async: false,
            success: res => {
                res.success ? result = res.data || {} : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    }

    /**
     * 获取学生预定状态课堂数据
     * @param code                 学生编码
     */
    getBookClassroom(code: string, timeZone?: string) {
        let me = this, result: any = {};
        me.ajax.get({
            url: '/student/classroom/book',
            data: {studentCode: code},
            async: false,
            success: res => {
                if (res.success) result = res.data; else swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        result.forEach(ret => {
            if (ret.classroom && ret.classroom.startTime) ret.classroom.startTime = me.tools.UTCToTimeZoneDate(ret.classroom.startTime, timeZone);
            if (ret.classroom && ret.classroom.endTime) ret.classroom.endTime = me.tools.UTCToTimeZoneDate(ret.classroom.endTime, timeZone);
            if (ret.classroom && ret.classroom.updateTime) ret.classroom.updateTime = me.tools.UTCToTimeZoneDate(ret.classroom.updateTime, timeZone);
        });
        return result;
    };

    /**
     * 获取学生取消预约状态的课堂数据
     * @param code 学生编码
     */
    cancelClassroom(curPage:any,pageSize:any,studentCode: string, timeZone?: string) {
        let me = this, result:any;
        me.ajax.get({
            url: '/student/classroom/cancel/list',
            data: {curPage:curPage,pageSize:pageSize,studentCode: studentCode},
            async: false,
            success: res => {
                if (res.success) result = res.data;
                else {
                    result=new Page();
                    result.lastPage=true;
                    swat(SettingsService.I18NINFO.swat.e102)
                };
            },
            error: res => {
                console.log(res);
            }
        });

        // 时区转换
        result.voList.forEach(ret => {
            if (ret.classroom &&ret.classroom.startTime) ret.classroom.startTime = me.tools.UTCToTimeZoneDate(ret.classroom.startTime, timeZone);
            if (ret.classroom &&ret.classroom.endTime) ret.classroom.endTime = me.tools.UTCToTimeZoneDate(ret.classroom.endTime, timeZone);
            if (ret.classroom &&ret.classroom.updateTime) ret.classroom.updateTime = me.tools.UTCToTimeZoneDate(ret.classroom.updateTime, timeZone);
        });
        return result;
    };


    /**
     * 封装学生预定状态课堂数据（加入教师信息）
     * @param data              预定状态课堂数据
     */
    bookClassroomMore(data: any, timeZone?: string) {
        let me = this, tutorCode: string, classroomTutors: Array<any>;
        data.classrooms = data.classrooms || [];
        data.classrooms.forEach(ele => {
            if (timeZone) { //时区转换处理
                if (ele.startTime) ele.startTime = me.tools.UTCToTimeZoneDate(ele.startTime, timeZone);
                if (ele.endTime) ele.endTime = me.tools.UTCToTimeZoneDate(ele.endTime, timeZone);
                if (ele.updateTime) ele.updateTime = me.tools.UTCToTimeZoneDate(ele.updateTime, timeZone);
            }
            classroomTutors = ele.classroomTutors;
            classroomTutors.forEach(val => {
                if (val.state == SettingsService.Absent) tutorCode = val.tutorCode;
            });
            // if (ele.courseTimetable) {
            me.getTutorInfo(tutorCode, "", res => {
                ele.tutorInfo = res;
            });
            // }
        });
    }

    /**
     * 获取学生待上课状态课堂
     * @param code                 学生编码
     */
    getConfirmedClassroom(code: string, timeZone?: string) {
        let me = this, result = {classrooms: []};
        me.ajax.get({
            url: '/student/classroom/confirmed',
            data: {studentCode: code},
            async: false,
            success: res => {
                res.success ? result = res.data || {classrooms: []} : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        //时区转换
        if (timeZone) me.conversionTimeZone(result, timeZone);
        return result;
    };

    /**
     * 封装待上课状态课堂数据（加入教师信息）
     * @param data            待上课状态课堂数据
     */
    confirmedClassroomMore(data) {
        let me = this, tutorCode: string, classroomTutors: Array<any>;
        data.classrooms = data.classrooms || [];
        data.classrooms.forEach(ele => {
            classroomTutors = ele.classroomTutors;
            classroomTutors.forEach(val => {
                if (val.state == SettingsService.Absent) tutorCode = val.tutorCode;
            });
            // if (ele.courseTimetable) {
            me.getTutorInfo(tutorCode, "", res => {
                ele.tutorInfo = res;
            });
            // }
        });
    }

    /**
     * 获取学生为填写的已完结状态课堂
     * @param {string} code           学生编码
     * @param {number} curPage         当前页
     * @param {number} pageSize         分页大小
     */
    getNoWriteClassroom(code: string, curPage: number, pageSize: number,timeZone?: string) {
        let me = this, result = {voList: []};
        me.ajax.get({
            url: '/student/classroom/ended',
            data: {studentCode: code, curPage: curPage, pageSize: pageSize,isQuestionnaire:'N'},
            async: false,
            success: res => {
                res.success ? result = res.data || {classrooms: []} : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        //时区时间转换
        let voList = result.voList;
        if (voList) {
            voList.forEach(ret => {
                if (ret.startTime) ret.startTime = me.tools.UTCToTimeZoneDate(ret.startTime, timeZone);
                if (ret.endTime) ret.endTime = me.tools.UTCToTimeZoneDate(ret.endTime, timeZone);
                if (ret.updateTime) ret.updateTime = me.tools.UTCToTimeZoneDate(ret.updateTime, timeZone);
            })
        }
        return result;
    };

    /**
     * 获取学生已完结状态课堂
     * @param {string} code           学生编码
     * @param {number} curPage         当前页
     * @param {number} pageSize         分页大小
     */
    getEndedClassroom(code: string, curPage: number, pageSize: number, timeZone?: string) {
        let me = this, result = {voList: []};
        me.ajax.get({
            url: '/student/classroom/ended',
            data: {studentCode: code, curPage: curPage, pageSize: pageSize},
            async: false,
            success: res => {
                res.success ? result = res.data || {classrooms: []} : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        //时区时间转换
        let voList = result.voList;
        if (voList) {
            voList.forEach(ret => {
                if (ret.startTime) ret.startTime = me.tools.UTCToTimeZoneDate(ret.startTime, timeZone);
                if (ret.endTime) ret.endTime = me.tools.UTCToTimeZoneDate(ret.endTime, timeZone);
                if (ret.updateTime) ret.updateTime = me.tools.UTCToTimeZoneDate(ret.updateTime, timeZone);
            })
        }
        return result;
    };

    /**
     * 封装已完结课堂状态数据（加入教师信息）
     * @param data           已完结状态课堂数据
     */
    endedClassroomMore(data) {
        let me = this, tutorCode: string, classroomTutors: Array<any>;
        data.classrooms = data.classrooms || [];
        data.classrooms.forEach(ele => {
            classroomTutors = ele.classroomTutors;
            classroomTutors.forEach(val => {
                if (val.state == SettingsService.Absent) tutorCode = val.tutorCode;
            });
            // if (ele.courseTimetable) {
            me.getTutorInfo(tutorCode, "", res => {
                ele.tutorInfo = res;
            });
            // }
        });
    }

    /**
     * 获取教师课程数量，收藏数量，评论数量信息
     * @param {string} tutorCode            教师编码
     * @param {string} courseCode           课程编码
     * @param callback           成功回调
     */
    getTutorInfo(tutorCode: string, courseCode: string, callback?: any) {
        let me = this;
        me.ajax.get({
            url: '/statis/tutor/favorite/feedback/classroom/total',
            data: {tutorCode: tutorCode, courseCode: courseCode},
            success: res => {
                res.success ? callback && callback(res.data || {}) : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
    };

    /**
     * 学生收藏教师
     * @param {string} tutorCode              教师编码
     * @param {string} studentCode            学生编码
     * @param callback                  成功回调
     */
    favorite(tutorCode: string, studentCode: string, callback?: any) {
        let me = this;
        me.ajax.post({
            url: '/student/favorite',
            data: {tutorCode: tutorCode, studentCode: studentCode},
            success: res => {
                res.success ? callback && callback(res) : swat(SettingsService.I18NINFO.swat.e224);
            },
            error: res => {
                console.log(res);
            }
        });
    };

    /**
     * 学生取消收藏老师
     * @param {string} tutorCode              教师编码
     * @param {string} studentCode           学生编码
     * @param callback                成功回调
     */
    delfavorite(tutorCode: string, studentCode: string, callback?: any) {
        let me = this;
        me.ajax.put({
            url: '/student/favorite/delete',
            data: {tutorCode: tutorCode, studentCode: studentCode},
            success: res => {
                res.success ? callback && callback(res) : swat(SettingsService.I18NINFO.swat.e224);
            },
            error: res => {
                console.log(res);
            }
        });
    };

    /**
     * 为学生加载一个课堂详情
     * @param {string} classroomCode            课堂编码
     * @param {string} studentCode              学生编码
     * @returns {any}                返回课堂详情对象
     */
    loadAll(classroomCode: string, studentCode: string, timeZone?: string) {
        let me = this, result: any = {};
        me.ajax.get({
            url: 'classroom/student/load',
            data: {classroomCode: classroomCode, studentCode: studentCode},
            async: false,
            success: res => {
                if (res.success) result = res.data || {};
            },
            error: res => {
                console.log(res);
            }
        });
        //时区转换
        if (timeZone && result.startTime) result.startTime = me.tools.UTCToTimeZoneDate(result.startTime, timeZone);
        if (timeZone && result.endTime) result.endTime = me.tools.UTCToTimeZoneDate(result.endTime, timeZone);
        if (timeZone && result.updateTime) result.updateTime = me.tools.UTCToTimeZoneDate(result.updateTime, timeZone);
        let traces: Array<any> = result.classroomTraces;
        traces.forEach(ret => {
            ret.createTime = me.tools.UTCToTimeZoneDate(ret.createTime, timeZone);
        })
        return result;
    };


    /**
     * 增加学生留言信息
     * @param messageContent 留言内容
     * @param classroomCode  课堂编码
     * @param tutorCode      老师编码
     * @param studentCode    学生编码
     */
    addStuMessage(messageContent,classroomCode,tutorCode,studentCode){
        let me = this, result: any = {};
        me.ajax.post({
            url: '/message/addStudentMessage',
            data: {messageContent: messageContent, classroomCode: classroomCode,tutorCode: tutorCode,studentCode: studentCode},
            async: false,
            success: res => {
                if (res.success) result = res.success || {};
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    }

    /**
     * 学生查询留言信息
     * @param classroomCode  课堂编码
     * @param studentCode    学生编码
     * @param timeZone       时区
     */
    stuGetMessage(classroomCode,studentCode,timeZone){
        let me = this, result: any = {};
        me.ajax.post({
            url: '/message/queryStudentMessage',
            data: {classroomCode: classroomCode,studentCode: studentCode},
            async: false,
            success: res => {
                if (res.success) result = res.data || {};
                if(res.data.length>0){
                    res.data.forEach(ret => {
                        ret.createTime = me.tools.UTCToTimeZoneDate(ret.createTime, timeZone);
                    })
                }
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    }

    /**
     * 时区转换（私有）
     * @param result
     * @param timeZone
     */
    conversionTimeZone(result: any, timeZone: string) {
        let me = this, classrooms: Array<any> = result.classrooms;
        classrooms.forEach(ret => {
            if (ret.startTime) ret.startTime = me.tools.UTCToTimeZoneDate(ret.startTime, timeZone);
            if (ret.endTime) ret.endTime = me.tools.UTCToTimeZoneDate(ret.endTime, timeZone);
            if (ret.updateTime) ret.updateTime = me.tools.UTCToTimeZoneDate(ret.updateTime, timeZone);
        });
    }

    /**
     * 获取购买记录数据
     * @param {string} consumerCode       买家编码
     * @param {number} curPage            当前页
     * @param {number} pageSize           分页大小
     * @param otherData                   其他搜索数据
     * @returns {{}}                      返回购买记录对象
     */
    getOrders(consumerCode: string, curPage: number, pageSize: number, timeZone?: string) {
        let me = this, result = {voList: []};
        let data = {consumerCode: consumerCode, curPage: curPage, pageSize: pageSize};
        me.ajax.get({
            url: '/order/orders',
            data: data,
            async: false,
            success: res => {
                res.success ? result = res.data : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });

        //结果集时区转换为当前时区
        if (!isNullOrUndefined(result) && timeZone) {
            let voList: Array<any> = result.voList;
            if (!isNullOrUndefined(voList)) {
                voList.forEach(ret => {
                    ret.createTime = me.tools.UTCToTimeZoneDate(ret.createTime, timeZone);
                    ret.updateTime = me.tools.UTCToTimeZoneDate(ret.updateTime, timeZone);
                    if (!isNullOrUndefined(ret.payedTime) && ret.payedTime != "") ret.payedTime = me.tools.UTCToTimeZoneDate(ret.payedTime, timeZone);
                })
            }
        }
        return result;
    };

    /**
     * 加载订单详情
     * @param orderNo               订单编码
     * @returns {{}}               返回订单数据对象
     */
    loadOrderDetail(orderNo: string, timeZone?: string) {
        let me = this, result;
        me.ajax.get({
            url: '/order/load/detail',
            data: {orderNo: orderNo},
            async: false,
            success: res => {
                res.success ? result = res.data || {} : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });

        //处理时区时间
        if (!isNullOrUndefined(result) && timeZone) {
            result.createTime = me.tools.UTCToTimeZoneDate(result.createTime, timeZone);
            result.updateTime = me.tools.UTCToTimeZoneDate(result.updateTime, timeZone);
            if (!isNullOrUndefined(result.payedTime) && result.payedTime != "") result.payedTime = me.tools.UTCToTimeZoneDate(result.payedTime, timeZone);
            let orderPayments: Array<any> = result.orderPayments;
            let orderTraces: Array<any> = result.orderTraces;
            if (orderPayments) {
                orderPayments.forEach(ret => {
                    ret.createTime = me.tools.UTCToTimeZoneDate(ret.createTime, timeZone);
                    ret.payTime = me.tools.UTCToTimeZoneDate(ret.payTime, timeZone);
                })
            }
            if (orderTraces) {
                orderTraces.forEach(ret => {
                    ret.createTime = me.tools.UTCToTimeZoneDate(ret.createTime, timeZone);
                })
            }
        }
        return result;
    };

    /**
     * 判断学生是否已经收藏了老师
     * @param tutorCode 老师编码
     * @param studentCode 学生编码
     * @raturn true:已经收藏，false：未收藏
     */
    checkIsFavorite(tutorCode: string, studentCode: string) {
        let me = this, result: boolean;
        me.ajax.get({
            url: '/student/favorite/tutor/detail',
            data: {tutorCode: tutorCode, studentCode: studentCode},
            async: false,
            success: res => {
                result = res.success;
            }
        });
        return result;
    };

    /**
     * 学生自定义课程查询老师的列表
     * @data 查询参数
     */
    getTutorListForCustom(data: any) {
        let _this = this, ret: Page = new Page();
        data.startDate = _this.tools.timeZoneDateToUTC(data.startDate, data.timeZone);
        data.endDate = _this.tools.timeZoneDateToUTC(data.endDate, data.timeZone);
        _this.ajax.get({
            url: "/tutor/custom/list",
            data: data,
            async: false,
            mask: true,
            success: (response) => {
                if (response.success) ret = response.data;
            }
        });
        return ret;
    }

    /**
     * 学生预约上课
     * @data 传入参数
     * @returns {any}
     */
    customClassroomForStudent(data: any) {
        let _this = this, ret: any;
        _this.ajax.post({
            url: '/classroom/custom/book',
            data: data,
            async: false,
            mask: true,
            success: (response) => {
                ret = response;
            }
        });
        return ret;
    }

    /**
     * 上传图片
     * @param studentCode        学生编码
     * @param file              图片base64
     * @param callback         成功回调
     */
    upload(studentCode: string, file: string, callback: any) {
        let me = this,
            uid = me.tools.uploadUid();
        file = file.split('base64,')[1];
        me.ajax.post({
            url: '/upload/student/avatar',
            data: {file: file, uid: uid},
            success: res => {
                if (res.success) {
                    me.updataPic(studentCode, uid, callback);
                } else {
                    swat(SettingsService.I18NINFO.swat.e225, SettingsService.I18NINFO.swat.e227, 'error');
                }
                ;
            },
            error: res => {
                console.log(res);
            }
        });
    }

    /**
     * 更新学生头像
     * @param studentCode       学生编码
     * @param uid               上传图片唯一标识
     * @param callback          成功回调
     */
    updataPic(studentCode: string, uid: string, callback: any) {
        let me = this;
        me.ajax.put({
            url: '/student/avatar',
            data: {studentCode: studentCode, uid: uid},
            success: res => {
                console.log(res);
                if (res.success) {
                    callback();
                } else {
                    swat(SettingsService.I18NINFO.swat.e225, SettingsService.I18NINFO.swat.e227, 'error');
                }
                ;
            },
            error: res => {
                console.log(res);
            }
        });
    }

    /**
     * 修改学生信息
     * @param studentCode         学生编码
     * @param studentInfo          学生信息
     * @param callback           成功回调
     * @param file               图片base64
     */
    modifyStudent(studentCode: string, studentInfo: any, callback: any, file?: string,) {
        let me = this;
        studentInfo.studentCode = studentCode;
        me.ajax.put({
            url: '/student/modify',
            data: studentInfo,
            success: res => {
                if (res.success) {
                    if (file) {
                        me.upload(studentCode, file, callback);
                    } else {
                        callback();
                    }
                    ;
                } else {
                    swat(SettingsService.I18NINFO.swat.e123, SettingsService.I18NINFO.swat.e125, 'error');
                }
                ;
            },
            error: res => {
                console.log(res);
            }
        });
    }

    /**
     * 教师课堂留言
     * @param classroomCode       课堂编码
     * @param tutorCode        教师编码
     * @param feedback        留言内容
     */
    leaveMsg(classroomCode: string, studentCode: string, tutorCode: string, feedback: string, starLevel: number, callback?: any) {
        let me = this;
        me.ajax.post({
            url: '/classroom/student/feedback',
            data: {
                classroomCode: classroomCode,
                studentCode: studentCode,
                tutorCode: tutorCode,
                feedbackMan: 'Student',
                feedback: feedback,
                starLevel: starLevel
            },
            success: res => {
                res.success ? callback && callback(res) : swat(SettingsService.I18NINFO.swat.e228, SettingsService.I18NINFO.swat.e230, 'error');
            },
            error: res => {
                console.log(res);
            }
        })
    }

    /**
     * 获取学生课时
     * @param studentCode    学生编码
     * @returns {{}}     返回课时数据对象
     */
    getCourseHour(studentCode) {
        let me = this, result = {};
        me.ajax.get({
            url: '/student/load/hour',
            data: {studentCode: studentCode},
            async: false,
            success: res => {
                console.log(res);
                res.success ? result = res.data : swat(SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    };

    /**
     * 获取调查问卷记录
     * @param classroomCode              课堂编码
     */
    loadStudentQuestionnaireRecord(classroomCode: any) {
        const me = this;
        let result: any;
        let data = {classroomCode: classroomCode};
        me.ajax.get({
            url: '/classroom/loadStudentQuestionnaireRecord',
            data: data,
            async: false,
            success: res => {
                res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.classroom.queryErr);
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    };
}
