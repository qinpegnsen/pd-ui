import { Injectable } from '@angular/core';
import { AjaxService } from "../../core/services/ajax.service";
import { Page } from "../../core/page/page";
import { RzhtoolsService } from "../../core/services/rzhtools.service";

@Injectable()
export class SearchService {

	constructor(public ajax: AjaxService, public tools: RzhtoolsService) {
	}

	/**
	 * 查询课程分类列表
	 */
	coursesTypeList() {
		let _this = this, ret: Array<any> = new Array();
		_this.ajax.get({
			url: '/course/category/list',
			data: { curPage: 1, pageSize: 999, state: "Activate" },
			async: false,
			success: (response) => {
				if (response.success) ret = response.data.voList;
			}
		})
		if (ret.length > 0) ret = _this.tools.arrayToTree(ret, "categoryCode");
		return ret;
	}

	/**
	 *  查询一条课程信息
	 * @param courseCode
	 */
	loadCourse(courseCode: string) {
		let _this = this, ret: any = {};
		_this.ajax.get({
			url: '/course/load',
			data: { courseCode: courseCode },
			async: false,
			success: (response) => {
				if (response.success) ret = response;
			}
		})
		return ret;
	}

	/**
	 * 查询课程列表
	 * @param categoryCode
	 * @returns {Array<any>}
	 */
	coursesList(categoryCode?: string) {
		let _this = this, ret: Array<any> = new Array();
		_this.ajax.get({
			url: '/course/list',
			data: { curPage: 1, pageSize: 999, categoryCode: categoryCode },
			async: false,
			success: (response) => {
				if (response.success) ret = response.data.voList;
			}
		})
		return ret;
	}

	/**
	 * 查询热门课程列表
	 *
	 * @returns {Array<any>}
	 */
	getHotCourseList() {
		let _this = this, ret: Array<any> = new Array();
		_this.ajax.get({
			url: '/course/hot/list',
			data: {},
			async: false,
			success: (response) => {
				if (response.success) ret = response.data;
			}
		})
		return ret;
	}

	/**
	 * 查询老师列表
	 * @param data
	 * @returns {Array<any>}
	 */
	tutorList(data: any) {
		let _this = this, ret: Page = new Page();
		_this.ajax.get({
			url: '/timetable/tutor/list',
			data: data,
			async: false,
			mask: true,
			success: (response) => {
				if (response.success) ret = response.data;
			}
		})
		return ret;
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
				if (response.success) {
					ret = response.data;
				}else{
					// ret=;
				}
			}
		})
		return ret;
	}

}
