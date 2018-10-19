import { Page } from './../../core/page/page';
import { Injectable } from '@angular/core';
import { SettingsService } from '../../core/settings/settings.service';
import { AjaxService } from "../../core/services/ajax.service";
import { RzhtoolsService } from "../../core/services/rzhtools.service";
import {AppComponent} from "../../app.component";
import {Location} from '@angular/common';
import * as momentDate from 'moment';
import {Router} from "@angular/router";
const swat = require('sweetalert');

@Injectable()
export class TutorService {

	constructor(public settings: SettingsService,public ajax: AjaxService, public tools: RzhtoolsService,public location: Location) {
	}

	/**
	 * 增加老师留言信息
	 * @param messageContent 留言内容
	 * @param classroomCode  课堂编码
	 * @param tutorCode      老师编码
	 * @param studentCode    学生编码
	 */
	addTutorsMessage(messageContent,classroomCode,tutorCode,studentCode){
		let me = this, result: any = {};
		me.ajax.post({
			url: '/message/addTutorsMessage',
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
	 * 老师群发留言信息（系统留言）
	 * @param messageContent 留言内容
	 * @param classroomCode  课堂编码
	 *
	 */
	addSysMessage(messageContent,classroomCode){
		let me = this, result: any = {};
		me.ajax.post({
			url: '/message/addSysMessage',
			data: {messageContent: messageContent, classroomCode: classroomCode},
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
	 * 老师查询留言信息
	 * @param classroomCode  课堂编码
	 * @param studentCode    学生编码
	 * @param timeZone       时区
	 */
	tutorGetMessage(classroomCode,tutorCode,timeZone){
		let me = this, result: any = {};
		me.ajax.post({
			url: '/message/queryTutorMessage',
			data: {classroomCode: classroomCode,tutorCode: tutorCode},
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
				if(res.data.length>0){
					res.data.forEach(ret => {
						ret.messageInfo.forEach(item=>{
							item.createTime = me.tools.UTCToTimeZoneDate(item.createTime, timeZone);
						});
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
	 * 获取预定状态课堂
	 * @param tutorCode      教师编码
	 * @returns {any}        返回预约状态课堂数据
	 */
	getBookClassroom(tutorCode: string, timeZone?: string) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/tutor/classroom/book',
			data: { tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
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
	 * 时区转换（私有）
	 * @param result
	 * @param timeZone
	 */
	conversionTimeZone(result: any, timeZone: string) {
		let me = this, classrooms: Array<any> = result.classrooms;
		if (classrooms) {
			classrooms.forEach(ret => {
				ret.startTime = me.tools.UTCToTimeZoneDate(ret.startTime, timeZone);
				ret.endTime = me.tools.UTCToTimeZoneDate(ret.endTime, timeZone);
				ret.updateTime = me.tools.UTCToTimeZoneDate(ret.updateTime, timeZone);
			});
		}

	}

	/**
	 * 查询老师被取消预约的课堂信息
	 * @param tutorCode
	 * @returns {any}
	 */
	cancelClassroom(curPage: any,pageSize: any,tutorCode: string, timeZone?: string) {
		let me = this, result:any;
		me.ajax.get({
			url: '/student/tutorClassroomCancelList',
			data: {curPage:curPage,pageSize:pageSize,tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) {
					result = res.data || new Array()
				}else{
					result=new Page();
					result.lastPage=true;
					swat(SettingsService.I18NINFO.swat.e102);
				};
			},
			error: res => {
				console.log(res);
			}
		});
		// 时区转换
		result.voList.forEach(ret => {
			ret.classroom.startTime = me.tools.UTCToTimeZoneDate(ret.classroom.startTime, timeZone);
			ret.classroom.endTime = me.tools.UTCToTimeZoneDate(ret.classroom.endTime, timeZone);
			ret.classroom.updateTime = me.tools.UTCToTimeZoneDate(ret.classroom.updateTime, timeZone);
		});
		return result;
	}

	/**
	 * 获取即将上课状态课堂
	 * @param {string} tutorCode          教师编码
	 * @returns {any}                     课堂数据
	 */
	getConfirmClassroom(tutorCode: string, timeZone?: string) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/tutor/classroom/confirmed',
			data: { tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
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
	 * 获取已完结课堂信息
	 * @param {string} tutorCode          教师编码
	 * @returns {any}                     课堂数据
	 */
	getFinshedClassroom(tutorCode: string, curPage: number, pageSize: number, timeZone?: string) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/tutor/classroom/ended',
			data: { tutorCode: tutorCode, curPage: curPage, pageSize: pageSize },
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
			},
			error: res => {
				// console.log(res);
			}
		});
		//时区时间转换
		let voList = result.voList;
		if (voList) {
			voList.forEach(ret => {
				ret.startTime = me.tools.UTCToTimeZoneDate(ret.startTime, timeZone);
				ret.endTime = me.tools.UTCToTimeZoneDate(ret.endTime, timeZone);
				ret.updateTime = me.tools.UTCToTimeZoneDate(ret.updateTime, timeZone);
			})
		}
		return result;
	};

	/**
	 * 获取已完结课堂未填写调查问卷信息
	 * @param {string} tutorCode          教师编码
	 * @returns {any}                     课堂数据
	 */
	getNoWriteClassroom(tutorCode: string, curPage: number, pageSize: number, timeZone?: string) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/tutor/classroom/ended',
			data: { tutorCode: tutorCode, curPage: curPage, pageSize: pageSize,isTutorFeedback:'N'},
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
			},
			error: res => {
				// console.log(res);
			}
		});
		//时区时间转换
		let voList = result.voList;
		if (voList) {
			voList.forEach(ret => {
				ret.startTime = me.tools.UTCToTimeZoneDate(ret.startTime, timeZone);
				ret.endTime = me.tools.UTCToTimeZoneDate(ret.endTime, timeZone);
				ret.updateTime = me.tools.UTCToTimeZoneDate(ret.updateTime, timeZone);
			})
		}
		return result;
	};

	/**
	 * 加载一位教师的基础信息
	 * @param tutorCode 教师编码
	 * @returns {any}
	 */
	load(tutorCode) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/tutor/load',
			data: { tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
			}
		});
		return result;
	};

	/**
	 * 加载一位教师的详细信息
	 * @param tutorCode 教师编码
	 * @returns {any}
	 */
	loadDetail(tutorCode) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/tutor/loadall',
			data: { tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
			}
		});
		return result;
	};

	/**
	 * 加载一位教师的信息,包含统计：课时数，评语数，收藏数
	 * @param tutorCode 教师编码
	 * @returns {any}
	 */
	loadForTotal(tutorCode) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/tutor/classroom/favorite/feedback/load',
			data: { tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) {
					result = res.data || {}
				}else{
					swat(SettingsService.I18NINFO.swat.e104);
					result={};
					me.location.back();
				};
			}
		});
		return result;
	};

	/**
	 * 加载一位学生的信息,包含统计：课时数，评语数，收藏数
	 * @param studentCode 学生编码
	 * @returns {any}
	 */
	loadForStu(studentCode) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/student/loadStudentInfoDetail',
			data: { studentCode: studentCode },
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
			}
		});
		return result;
	};

	/**
	 * 加载老师对学生的评论信息
	 * @param studentCode 学生编码
	 * @returns {any}
	 */
	getFeedback(studentCode,curPage?) {
		let me = this, result: any = {};
		me.ajax.get({
			url: '/student/queryStudentClassroomList',
			data: {
				curPage:curPage||1,
				pageSize:5,
				studentCode: studentCode
			},
			async: false,
			success: res => {
				if (res.success) result = res.data || {};
			}
		});
		//时区时间转换
		let voList = result.voList;
		if (voList) {
			voList.forEach(ret => {
				ret.courseTime = me.tools.UTCToTimeZoneDate(ret.courseTime, me.settings.user.timeZone);
			})
		}
		return result;
	};


	/**
	 * 教师取消预定
	 * @param {string} tutorCode                  教师编码
	 * @param {string} studentCode                学生编码
	 * @param {string} classroomCode              课程编码
	 * @param callback                            回调方法
	 */
	cancelOrder(tutorCode: string, studentCode: string, classroomCode: string, isCustom: boolean, callback?: any) {
		let me = this;
		let url;
		if (isCustom) {
			url = '/classroom/tutorCancel';    //之前 有一个自定义预约的取消，现在去掉了

		} else {
			url = '/classroom/tutorCancel';
		}
		me.ajax.put({
			url: url,
			data: {studentCode: studentCode, classroomCode: classroomCode},
			success: res => {
				// console.log("res===",res);
				callback && callback(res);
			},
			error: res => {
				console.log("000--",res);
				console.log(res);
			}
		});
	};

	/**
	 * 教师确认预定
	 * @param {string} tutorCode                  教师编码
	 * @param {string} studentCode                学生编码
	 * @param {string} classroomCode              课程编码
	 * @param callback                            回调方法
	 */
	confirmed(tutorCode: string, studentCode: string, classroomCode: string, isCustom: boolean, callback?: any) {
		let me = this;
		let url;
		if (isCustom) {
			url = '/classroom/custom/confirmed';
		} else {
			url = '/classroom/confirmed';
		}
		me.ajax.put({
			url: url,
			data: { tutorCode: tutorCode, studentCode: studentCode, classroomCode: classroomCode },
			success: res => {
				// console.log("res===",res);
				callback && callback(res);
			},
			error: res => {
				console.log("000--",res);
				console.log(res);
			}
		});
	};

	/**
	 * 加载课堂详情for教师
	 * @param {string} classroomCode                课堂编码
	 * @param {string} tutorCode                    教师编码
	 * @returns {any}                               课堂详情数据
	 */
	loadAll(classroomCode: string, tutorCode: string, timeZone?: string) {
		let me = this, result: any = {};
		me.ajax.get({
			url: 'classroom/tutor/load',
			data: { classroomCode: classroomCode, tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) {
					result = res.data || {};
				}else{
					swat(SettingsService.I18NINFO.swat.e104);
					result={};
					me.location.back();
				}
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
		});
		return result;
	};

	/**
	 * 上传图片
	 * @param studentCode        学生编码
	 * @param file              图片base64
	 * @param callback         成功回调
	 */
	upload(tutorCode: string, file: string, callback: any) {
		let me = this,
			uid = me.tools.uploadUid();
		file = file.split('base64,')[1];
		me.ajax.post({
			url: '/upload/tutor/avatar',
			data: { file: file, uid: uid },
			success: res => {
				res.success ? me.updataPic(tutorCode, uid, callback) : swat(SettingsService.I18NINFO.swat.e225, SettingsService.I18NINFO.swat.e227, 'error');
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
	updataPic(tutorCode: string, uid: string, callback: any) {
		let me = this;
		me.ajax.put({
			url: '/tutor/avatar',
			data: { tutorCode: tutorCode, uid: uid },
			success: res => {
				console.log(res);
				res.success ? callback() : swat(SettingsService.I18NINFO.swat.e225, SettingsService.I18NINFO.swat.e227, 'error');
			},
			error: res => {
				console.log(res);
			}
		});
	}

	/**
	 * 修改教师信息
	 * @param studentCode         教师编码
	 * @param studentInfo          教师信息
	 * @param callback           成功回调
	 * @param file               图片base64
	 */
	modifyStudent(tutorCode: string, tutorInfo: any, callback: any, file?: string, ) {
		let me = this;
		tutorInfo.tutorCode = tutorCode;
		me.ajax.put({
			url: '/tutor/modify',
			data: tutorInfo,
			success: res => {
				if (res.success) {
					file ? me.upload(tutorCode, file, callback) : callback();
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
	leaveMsg(classroomCode: string, tutorCode: string, studentCode: string, feedback: string, starLevel: number, callback?: any) {
		let me = this;
		me.ajax.post({
			url: '/classroom/tutor/feedback',
			data: { classroomCode: classroomCode, tutorCode: tutorCode, studentCode: studentCode, starLevel: starLevel, feedbackMan: 'Tutor', feedback: feedback },
			success: res => {
				res.success ? callback && callback(res) : swat(SettingsService.I18NINFO.swat.e228, SettingsService.I18NINFO.swat.e230, 'error');
			},
			error: res => {
				console.log(res);
			}
		})
	}

	/**
	 * 判断课程是否可评价
	 * @param courseCode       课程编码
	 * @param studentCode        学生编码
	 * @param tutorCode          教师编码
	 * @returns {boolean}         返回布尔
	 */
	checkAssess(courseCode: string, studentCode: string, tutorCode: string) {
		let me = this;
		let result = false;
		me.ajax.get({
			url: '/tutor/check/assess',
			data: { courseCode: courseCode, studentCode: studentCode, tutorCode: tutorCode },
			async: false,
			success: res => {
				if (res.success) result = res.data;
			},
			error: res => {
				console.log(res);
			}
		})
		return result;
	}

	/**
	 * 教师给学员评级
	 * @param studentCode       学生编码
	 * @param chineseLevel      汉语级别
	 * @param assessmentSummary    评估备注
	 * @param callback     成功回调
	 */
	assess(studentCode: string, chineseLevel: string, assessmentSummary: string, callback?: any) {
		let me = this;
		me.ajax.put({
			url: '/student/modify',
			data: {studentCode: studentCode, chineseLevel: chineseLevel, assessmentSummary: assessmentSummary},
			success: res => {
				if (res.success) {
					callback && callback(res);
				} else {
					swat(SettingsService.I18NINFO.swat.e243, SettingsService.I18NINFO.swat.e244, 'error');
				}
			},
			error: res => {
				console.log(res);
			}
		})
	}

	/**
	 * 获取还未被评论的学员信息
	 * @param classroomCode 课程编码
	 * @returns {any}
	 */
	classroomFeedbackStudent(classroomCode: string) {
		let me = this, result: Array<any> = new Array();
		me.ajax.get({
			url: '/classroom/feedback/students',
			data: { classroomCode: classroomCode },
			async: false,
			success: res => {
				if (res.success){
					result = res.data || new Array();
				}else{
					swat(SettingsService.I18NINFO.swat.e104);
					result =  new Array();
				}
			}
		});
		return result;
	}

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

	/**
	 * 获取开始课堂数据
	 * @param classroomCode 课堂编码
	 * @param tutorCode  教师编码
	 * @param callback  回调
	 */
	startClassroom(classroomCode: string, tutorCode: string, callback?: any) {
		let me = this;
		me.ajax.get({
			url: '/classroom/start',
			data: { classroomCode: classroomCode, tutorCode: tutorCode },
			async: false,
			success: res => {
				callback && callback(res);
			}
		});
	}

	/**
	 * 查询老师的评论列表
	 * @param curPage  当前页码
	 * @param pageSize 分页大小
	 * @param tutorCode  老师或学生编码
	 * @param feedbackMan  评论人类型
	 */
	queryFeedbackList(curPage: number= 1, pageSize: number= 10, tutorCode: string, feedbackMan: string) {
		let _this = this, ret: Page = new Page();
		_this.ajax.get({
			url: '/tutor/queryFeedbackList',
			data: {
				curPage: curPage,
				pageSize: pageSize,
				code: tutorCode,
				feedbackMan: feedbackMan
			},
			async: false,
			mask: true,
			success: (response) => {
				if (response.success) ret = response.data;
			}
		})
		return ret;
	}


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
				feedbackMan:'Tutor'
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
     * 获取课程详情
     * @param code          课程编码
     * @returns {any}       返回课程详情数据
     */
    getCourse(code) {
        let me = this;
        let result;
        me.ajax.get({
            url: '/course/load',
            data: {courseCode: code},
            async: false,
            success: res => {
                if(res.success){
                    result = res.data || {};
                }else {
                    me.tools.rzhAlt('error', SettingsService.I18NINFO.course.getDetailErr);
                }
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    };


    /**
     * 查询可用教师集合
     */
    queryTutors() {
        let _this = this, tutorList: Array<any> = new Array();
        _this.ajax.get({
            url: "/tutor/activatetutors",
            async: false,
            success: function (res) {
                if (res.success) tutorList = res.data;
            }
        });
        return tutorList;
    }

    /**
     * 查询可用教师的课程集合
     */
    queryTutorCourse(tutorCode: string) {
        let _this = this, courseList: any;
        _this.ajax.get({
            url: "/tutor/loadall",
            data: {tutorCode: tutorCode},
            async: false,
            success: function (res) {
                if (res.success) courseList = res.data;
            }
        });
        return courseList;
    }

    /**
     * 查询一个老师的课表信息
     * @param tutorCode 教师编码
     * @param sDate 开始日期
     * @param Edate 结束日期
     */
    queryTimeTable(tutorCode: string, timeZone: string, sDate: string, eDate: string) {
        let _this = this, datas: Array<any> = new Array();
        sDate = _this.tools.timeZoneDateToUTC(sDate + " 00:00:00", timeZone); //开始时区时间转换
        eDate = _this.tools.timeZoneDateToUTC(eDate + " 23:59:59", timeZone); //结束时区时间转换
        _this.ajax.get({
            url: '/timetable/tutor/timetables',
            data: {
                tutorCode: tutorCode,
                // timeZone: timeZone,
                pageSize: "200", //分页长度，一页出来完
                startDate: sDate,
                endDate: eDate
            },
            mask: true,
            async: false,
            success: function (res) {
                if (res.success) datas = res.data.voList;
                else console.log(SettingsService.I18NINFO.swat.e102);
            }
        });
        datas.forEach(ret => {
            ret.courseTime = _this.tools.UTCToTimeZoneDate(ret.courseTime, timeZone); //转换时区
        });
        return datas;
    }

    /**
     * 铺设课表信息
     */
    timetableDefaultInfos(date: Date) {
        let _this = this, newDate: Date, dates: Datas, datesDate: string, datesWeek: string,
            times: Times, timetableData: Array<Datas> = [];
        for (let i = 0; i < 7; i++) { //未来七天信息设置
            dates = new Datas(); //实例化日期
            newDate = _this.tools.getAroundDateByDate(date, i); //获取日期
            datesDate = _this.tools.dataFormat(newDate, "yyyy-MM-dd"); //格式化日期
            datesWeek = _this.tools.getWeekTimeTable(newDate); //获取周几
            dates.date = datesDate; //设置日期
            dates.week = datesWeek; //设置星期几
            timetableData.push(dates) //设置信息集合
        }
        return timetableData;
    }

    /**
     * 设置装载信息，并标示出可选课表
     * @param datas 可选课表源
     * @param timetableData 铺设信息源
     * @returns {Array<Datas>}
     */
    setTimetableSel(datas: Array<any>, timetableData: Array<Datas>) {
        let _this = this, datasInfo, ttdInfo: Datas, timeInfo: Times, info;
        for (let a = 0; a < timetableData.length; a++) {
            ttdInfo = timetableData[a];
            ttdInfo.times = new Array(); //初始化
            for (let b = 0; b < datas.length; b++) {
                info = datas[b];
                datasInfo= momentDate(info.courseTime).format('YYYY-MM-DD HH:mm:ss');  //解决ie的兼容性问题，所以用这个方法
                // datasInfo = _this.tools.dataFormat(new Date(info.courseTime), "yyyy-MM-dd HH:mm:ss");
                if (ttdInfo.date == datasInfo.substr(0, 10)) {
                    timeInfo = new Times();
                    timeInfo.courseTime = _this.tools.dateToUnix(info.courseTime); //课程开始时间
                    timeInfo.courseEndTime = timeInfo.courseTime + info.duration * 60 * 1000; //课程结束时间
                    timeInfo.timetableCode = info.timetableCode; //课程编码
                    timeInfo.course = info.course; //设置课程名
                    timeInfo.amAndPm = info.amAndPm; //上午或下午
                    ttdInfo.times.push(timeInfo);
                }
            }
            ttdInfo.times.sort((a, b) => {
                return a.courseTime - b.courseTime
            });
        }
        return timetableData;
    }


    /**
     * 获取已选课程的对象集合
     * @param timetableData 课表集合
     * @returns {Array<Times>}
     */
    selTimeTableInfo(timetableData: Array<Datas>) {
        let timeList: Array<Times> = [], date: Datas, time: Times;
        for (let i = 0; i < timetableData.length; i++) {
            date = timetableData[i];
            for (let j = 0; j < date.times.length; j++) {
                time = date.times[j];
                if (time.sel) timeList.push(time);
            }
        }
        return timeList;
    }

    /**
     * 加载一个系统参数
     * @param key                        参数键值
     * @returns {any}                    参数值
     */
    loadSetting(key) {
        let result: any = '';
        const me = this;
        me.ajax.get({
            url: '/setting/loadset',
            data: {k: key},
            async: false,
            success: res => {
                res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e102);
            },
            error: res => {
                console.log(res);
            }
        });
        return result;
    };

    /**
     * 生成课表添加的信息
     * @param dates  选择的日期
     * @param infos  搜索的一些条件
     * @param advanceTime  允许提前几个小时安排课表
     */
    buildTimeTableInfo(dates: Array<string>, infos: any,startTime,advanceTime:number) {
		infos.stime= this.tools.dataFormat(startTime, "HH:mm:ss");
		let loadCourseData=this.loadCourse(infos.courseCode);    //制定课表的的时候传给后台，防止以后更改
        let courseGeneralTypeValue=loadCourseData.courseGeneralType;  //课程需求
        let courseCalculateType=loadCourseData.courseCalculateType;  //课时费类型
        infos.courseGeneralType=courseGeneralTypeValue;
        infos.courseCalculateType=courseCalculateType;
        let ren: Array<TimeTable> = new Array(), timeTable: TimeTable, _this = this, time: any, dataInfo: string;
        for (let date of dates) {
            timeTable = new TimeTable(), dataInfo = date + " " + infos.stime;

            /**
             * 可以对当天几小时内课过滤
             * @type {number}
             */
            let curHour=new Date().getTime();
            // let setHour=new Date(dataInfo).getTime();
            // let setHour=momentDate(dataInfo).format('X');   //解决ie的兼容性问题,获取时间戳这个有问题，版本不支持
            let setHour=momentDate(dataInfo).valueOf();   //解决ie的兼容性问题,获取时间戳
            if (setHour<curHour+(1000*60*60*advanceTime)){
                continue
            }

            time = momentDate(_this.tools.timeZoneDateToUTC(dataInfo, infos.zones)); //转换时区
            timeTable.tutorCode = infos.tutorCode; //教师编码
            timeTable.courseCode = infos.courseCode; //课程编码
            timeTable.courseGeneralType = infos.courseGeneralType; //课程总分类
            timeTable.courseCalculateType = infos.courseCalculateType; //课程总分类
            timeTable.course = infos.courseName; //课程名
            // timeTable.courseTimeString = _this.tools.dataFormat(time, "yyyy-MM-dd HH:mm:ss"); // 上课时间
            timeTable.courseTimeString = momentDate(time).format('YYYY-MM-DD HH:mm:ss');  //解决ie的兼容性问题，所以用这个方法
            timeTable.week = _this.tools.getWeekTimeTable(new Date(time)); //获取周几
            timeTable.amAndPm = _this.tools.dataFormat(new Date(time), "HH") < 12 ? "AM" : "PM";
            timeTable.duration = infos.duration; //课程时长
            timeTable.num = infos.num; //学员上限
            timeTable.courseHour = infos.courseHour; //所需课时
            timeTable.courseHourType = infos.courseHourType; //课时类型
            timeTable.state = infos.state; //课表状态
            timeTable.tuTimeZone = infos.zones; //时区信息
            ren.push(timeTable);
        }
        return ren;
    }

    /**
     * load 课程的课程详情，获取总分类
     */
    loadCourse(courseCode){
        let _this = this, result: any ;
        _this.ajax.get({
            url: '/course/load',
            data: {courseCode: courseCode},
            async: false,
            success: function (res) {
                if (res.success){
                    result=res.data
                }
                else{
                    _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102);
                }
            },
            error: function () {
                _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e104);
            }
        })
        return result;
    }

    /**
     * 添加课表信息
     * @param timeTable 课表信息
     */
    addTimeTable(timeTable: Array<TimeTable>) {
        let _this = this, isTrue: Boolean = false;
        _this.ajax.post({
            url: '/timetable/make',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(timeTable),
            async: false,
            success: function (res) {
                if (res.success) _this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e101, res.info), isTrue = true;
                else _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.timetable.addError);
            },
            error: function () {
                swat(SettingsService.I18NINFO.swat.e104, SettingsService.I18NINFO.swat.timetable.addMsg, 'error');
            }
        })
        return isTrue;
    }

    /**
     * 删除一节课表信息
     * @param timetableCode 课表标示
     */
    delTimeTable(timetableCode) {
        let _this = this, isTrue: Boolean = false;
        _this.ajax.get({
            url: '/timetable/delete',
            data: {timetableCode: timetableCode},
            async: false,
            success: function (res) {
                if (res.success) _this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e101, SettingsService.I18NINFO.swat.e127), isTrue = true;
                else _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e126);
            },
            error: function () {
                _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e104, SettingsService.I18NINFO.swat.e131);
            }
        })
        return isTrue;
    }

    /**
     * 设置可工作时间段
     * @param weeks
     * @param tutorWorktimes
     */
    setWorktime(weeks: Array<any>, tutorWorktimes: Array<any>) {
        let list: Array<Week> = new Array(), worktimeInfo: Week;
        weeks.forEach(week => {
            list = new Array();
            tutorWorktimes.forEach(worktime => {
                if (worktime.week == week.key) {
                    worktimeInfo = new Week("", worktime.startTime, worktime.endTime, worktime.week);
                    list.push(worktimeInfo)
                }
            })
            list.sort((a, b) => {
                return Number.parseInt(a.startTime) - Number.parseInt(b.startTime);
            })
            week.worktime = list;
        });
        weeks.sort((a, b) => {
            return a.val - b.val;
        });
        return weeks;
    }


}

/**
 * 日期对象
 */
export class Datas {
    date: string; //日期
    week: any; //周几
    bol: any; //是否工作
    times: Array<Times> = [] //时间集合
}

/**
 * 时间对象
 */
export class Times {
    timetableCode: string; //课表code
    studentCode: string //用户编码
    studentName: string //用户姓名
    studentEmail?: string //用户email
    courseHourType: string //消耗课时类型
    leaveMsg?: string //留言信息
    courseTime: number; //时间
    courseEndTime: number; //时间
    sel?: boolean = false; //是否选中
    amAndPm?: string; //上午 或 下午
    course?: string; //课程名
}

/**
 * 课表对象
 */
export class TimeTable {
    tutorCode: string; //老师编码
    courseCode: string; //课程编码
    course: string; //课程
    courseTimeString: string; //上课时间
    week: string; //星期几
    duration: string; //时长
    amAndPm: string; //上午或下午
    num: string; //预约上限
    advanceTimeString?: string; //提前预约时间
    courseHour: string; //所需课时
    courseHourType: string; //课时类型
    state: string; //状态
    tuTimeZone: string; //时区
    courseGeneralType: string; //课程总分类
    courseCalculateType: string; //课时费类型
}


/**
 * 定义教师工作时间的数据格式
 */
export class Week{
    tutorCode: string;
    startTime: string;
    endTime: string;
    week: string;
    state: string;
    constructor(tutorCode: string, startTime: string, endTime: string, week: string) {
        this.tutorCode = tutorCode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.week = week;
        this.state = 'available';
    };
};