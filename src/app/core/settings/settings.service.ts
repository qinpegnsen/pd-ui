import {Injectable} from '@angular/core';
import {RzhtoolsService} from "../services/rzhtools.service";

@Injectable()
export class SettingsService {
	public app: any;
	public user: any;
	static I18NINFO: any = {}; //国际化信息
	// 枚举数据的key
	static enums: any = {
		sexEnum: 1001, //性别
		courseHourType: 1002, //课时类型
		classroomState: 1003, //课堂状态
		courseTimetableState: 1004, //课表状态
		amPm: 1005, //上午或下午
		courseCategoryState: 1006, //课程类别
		courseType: 1007, //课程
		week: 1008, //周
		goodsState: 1009, //商品状态
		goodsAudit: 1010, //商品审核
		goodsPromotionType: 1011, //促销类型
		orderState: 1012, //订单状态
		orderDeleteState: 1013, //订单删除状态
		orderOrderSource: 1014, //订单来源
		orderRefundType: 1015, //退款模式
		assistantManageState: 1016, //管理状态
		tutorState: 1017, //教师状态
		assistantTutorState: 1018, //助教老师状态
		settingKey: 1019, //设置的key
		courseTranslate: 1029 //课程类型
	};
	static mobileMaxWidth: number = 768; //手机屏幕最大宽度
	static loginNotIntercept: Array<string> = [ //不自动检测登录的模块路径
		"/goods",
		// "/order",              //为了保护隐私暂时先去掉
		// "/search",
		"/pages/tutorInit"
	];
	static tutorMenu: Array<any> = new Array();
	public tutorMenuList: Array<any> = SettingsService.tutorMenu;
	static studentMenu: Array<any> = new Array();
	public studentMenuList: Array<any> = SettingsService.studentMenu;
	static timeList: Array<any> = [
		{val: "00:00"},
		{val: "01:00"},
		{val: "02:00"},
		{val: "03:00"},
		{val: "04:00"},
		{val: "05:00"},
		{val: "06:00"},
		{val: "07:00"},
		{val: "08:00"},
		{val: "09:00"},
		{val: "10:00"},
		{val: "11:00"},
		{val: "12:00"},
		{val: "13:00"},
		{val: "14:00"},
		{val: "15:00"},
		{val: "16:00"},
		{val: "17:00"},
		{val: "18:00"},
		{val: "19:00"},
		{val: "20:00"},
		{val: "21:00"},
		{val: "22:00"},
		{val: "23:00"},
		{val: "23:59"}
	];
	static menu: Array<any> = new Array(); //顶部导航
	public menuList: Array<any> = SettingsService.menu;
	static sidenavMenuList: Array<any> = new Array(); //侧面menu导航
	public sidenavMenu: Array<any> = SettingsService.sidenavMenuList;
	static sessionId: string = "sessionId"; //登录的cookie键名
	static alreadySelectCourse: Array<any> = new Array();
	static alreadySelectStartTime: string;
	static alreadySelectEndTime: string;
	static alreadySelectTimeZone: string;
	static goodsCommon: string = "Common"; //商品 ‘正常’状态
	static language = [{key: "en", val: "English"}, {key: "zh", val: "简体中文"}, {key: "zh-tw", val: "繁體中文"}]; //国际化语言列表
	static selectLanguage: string; //选中的语言信息
	static attend: string = "Attend"; //老师确认预约状态
	static Absent: string = "Absent"; //老师确认预约状态
	static custom: string = "Custom"; //自定义预约状态
	static overdue:string = "Overdue"; //预约课程过期未处理状态
	static reg: string = "Reg"; //教师‘注册’状态
	static coursewareList:Array<any> = new Array(); //某课堂课件列表
	static selCourseware:any; //某课堂所选课件信息
	static courseDuration:number = 0; //某课堂上课时长
	static courseTranslate:string = "Course"; //课程类型
	static studentIndex:string = "/manage/student"; //用户中心
	static tutorIndex:string = "/manage/tutor"; //教师中心
	static tutorLogin:string = "Tutor"; //老师登录标示
	static studentLogin:string = "Student"; //学员登陆标示
	static studentCancel:string = "Cancel"; //学生取消预约状态
	static studentBook:string = "Book"; //学生预约状态
	static i18nSelLanguage:string = "i18nInfo"; //切換國際化信息的cookie鍵名

	constructor(public tools: RzhtoolsService) {
		let _this = this;
		_this.checkMenu();

		/**
		 * 基础信息
		 * @type {{name: string; description: string; year: number}}
		 */
		_this.app = {
			name: '',
			description: '',
			year: ((new Date()).getFullYear())
		};
		_this.user = {}; //用户登录信息
	}

	public checkMenu(){
		let me = this;
		setTimeout(() => { //导航信息
			SettingsService.menu = [ //顶部导航
				{sel: true, url: "/goods", name: SettingsService.I18NINFO.menu.goods},
				{sel: false, url: "/search", name: SettingsService.I18NINFO.menu.order}
			];
			me.menuList = SettingsService.menu;
			SettingsService.tutorMenu = [
				{
					isHttp: false,  //通过这个属性来确定是否跳转到外部网站
					name: SettingsService.I18NINFO.tutorMenu.home,
					url: '/manage/tutor',
					icon: "fa fa-user"
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.tutorMenu.teachingRecord,
					url: '/manage/tutor/record',
					icon: 'fa fa-book'
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.tutorMenu.order,
					url: '/manage/tutor/order',
					icon: 'fa fa-tty'
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.tutorMenu.timetable,
					url: '/manage/tutor/timetable',
					icon: 'fa fa-calendar'
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.tutorMenu.setTimetable,
					url: '/manage/tutor/set',
					icon: 'fa fa-edit'
				}
				// ,
				// {
				// 	isHttp: false,
				// 	name: SettingsService.I18NINFO.tutorMenu.setUp,
				// 	url: '/manage/tutor/info',
				// 	icon: 'fa fa-gear'
				// }
			];

			SettingsService.studentMenu = [
				{
					isHttp: true,
					name: 'Pondlets',
					url: 'https://chinese.ponddy.com/learner/dashboard/',
					icon: "fa fa-puzzle-piece"
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.studentMenu.home,
					url: '/manage/student',
					icon: "fa fa-user"
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.studentMenu.classHour,
					url: '/manage/student/center',
					icon: 'fa fa-table'
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.studentMenu.order,
					url: '/manage/student/order',
					icon: "fa fa-tty"
				},
				{
					isHttp: false,
					name: SettingsService.I18NINFO.studentMenu.collection,
					url: '/manage/student/collection',
					icon: "fa fa-users"
				}
				// ,
				// {
				// 	isHttp: false,
				// 	name: SettingsService.I18NINFO.studentMenu.setUp,
				// 	url: '/manage/student/info',
				// 	icon: "fa fa-gear"
				// }
			];

			SettingsService.sidenavMenuList = [ //menu 导航
				{
					isHttp: true,
					url: "http://www.ponddy.com",
					name: SettingsService.I18NINFO.sidenavMenu.home,
					icon: "fa fa-home"
				},
				{
					isHttp: true,
					url: "https://chinese.ponddy.com",
					name: SettingsService.I18NINFO.sidenavMenu.ponddyChinese,
					icon: "fa fa-map-marker"
				},
				{
					isHttp: false,
					url: "/goods",
					name: SettingsService.I18NINFO.sidenavMenu.goods,
					icon: "fa fa-shopping-cart"
				},
				{
					isHttp: false,
					url: "/search",
					name: SettingsService.I18NINFO.sidenavMenu.order,
					icon: "fa fa-tty"
				}
			];

			me.menuList = SettingsService.menu;
			me.tutorMenuList = SettingsService.tutorMenu;
			me.studentMenuList = SettingsService.studentMenu;
			me.sidenavMenu = SettingsService.sidenavMenuList;
		}, 0)
	}
}
