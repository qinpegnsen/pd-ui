import {Injectable} from "@angular/core";
import {isNullOrUndefined} from "util";
import {areaJSON} from "./area";
import {AjaxService} from "./ajax.service";
import {CookieService} from "angular2-cookie/core";
import {Router} from '@angular/router';
import {SettingsService} from "../settings/settings.service";
declare var $: any;
import * as moment from 'moment-timezone';
import {TranslateService} from "@ngx-translate/core";
import {ToasterService} from "angular2-toaster";

@Injectable()
export class RzhtoolsService {

	public areaJson: any;
	public timezones: Array<any> = new Array();//时区信息
	public countryCode: Array<any> = new Array();//国家代码信息
	public enumData = {};
	public selectTutorUpperLimitForCustomNum: number = 0; //用户自定义课程所选老师上限
	static router: Router;


	// Angular2框架负责注入对象
	constructor(public route: Router, public ajax: AjaxService, public cookie: CookieService, public translate: TranslateService,public cookieService: CookieService,private toaster: ToasterService) {
		this.areaJson = areaJSON;
		RzhtoolsService.router = route;
	}


	/**
	 * 弹框提醒
	 * @param type 类型：error、success、wait、info、warning
	 * @param title 标题
	 * @param info 信息
	 */
	rzhAlt = function (type: string, title: string, info?: string) {
		if (isNullOrUndefined(info)) this.toaster.pop(type, title);
		else this.toaster.pop(type, title, info);
	}

	/**
	 * 格式化日期
	 * @param date 日期对象
	 * @param fmt  格式化形式
	 * @returns {any}
	 */
	dataFormat = function (date: Date, fmt) {
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"H+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	/**
	 * 根据指定日期，获取其前后日期
	 * @param date 指定日期
	 * @param num  时间 （1代表后一天，2代表后两天，-1代表前一天......等等）
	 */
	getAroundDateByDate = function (date: Date, num: number) {
		return new Date(date.getTime() + (1000 * 60 * 60 * 24) * num);
	}

	/**
	 * 根据指定日期，获取其前后日期(制定或者查看课表用)
	 * @param date 指定日期
	 * @param num  时间 （1代表后一天，2代表后两天，-1代表前一天......等等）
	 * 之前用的是new Date() 本地时间，课表日期没有根据选择的时区进行变化（这样写有问题 new Date还是当地的时区，但是时间是所选择的时区的当地时间，因为显示不要时区信息，所以这样写也没有问题）
	 */
	getAroundDateByDatemoment = function (date: any, num: number) {
		if(num<0){
			return new Date( date.subtract(Math.abs(num), 'days').format('YYYY-MM-DD HH:mm:ss'));
		}else{
			return new Date( date.add(Math.abs(num), 'days').format('YYYY-MM-DD HH:mm:ss'));
		}
	}

	/**
	 * 根据指定日期时间，获取其前后时间
	 * @param date 指定日期时间
	 * @param num  时间 （1代表后一小时，2代表后两小时，-1代表前一小时......等等）
	 */
	getAroundHourByDate = function (date: Date, num: number) {
		return new Date(date.getTime() + (1000 * 60 * 60) * num);
	}

	/**
	 * 根据日期获取是星期几
	 * @param date 日期
	 * @returns {string}
	 */
	getWeek = function (date: Date) {
		let today = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
		let week = today[date.getDay()];
		// let weeks: Array<any> = this.getEnumDataList(SettingsService.enums.week), week: string, num: number = date.getDay() + 1;
		// for (let i = 0; i < weeks.length; i++) {
		// 	if (num.toString() == weeks[i]["val"]) week = weeks[i]["key"];
		// }
		return week;
	}

	/**
	 * 根据日期获取是星期几（制定课表专用）
	 * @param date 日期
	 * @returns {string}
	 */
	getWeekTimeTable = function (date: Date) {
		let weeks: Array<any> = this.getEnumDataList(1008), week: string, num: number = date.getDay() + 1;
		for (let i = 0; i < weeks.length; i++) {
			if (num.toString() == weeks[i]["val"]) week = weeks[i]["key"];
		}
		return week;
	}

	/**
	 * 获取日期时间戳
	 * @param string 日期：2017-08-14 或 2017-08-14 15:30:00
	 * @returns {number}
	 * @constructor
	 */
	dateToUnix = function (string) {
		var f = string.split(' ', 2);
		var d = (f[0] ? f[0] : '').split('-', 3);
		var t = (f[1] ? f[1] : '').split(':', 3);
		return (new Date(
			parseInt(d[0], 10) || null,
			(parseInt(d[1], 10) || 1) - 1,
			parseInt(d[2], 10) || null,
			parseInt(t[0], 10) || null,
			parseInt(t[1], 10) || null,
			parseInt(t[2], 10) || null
		)).getTime();
	}

	/**
	 * 根据类型标示获取枚举信息
	 * @param code 类型标示（如：1001、1002、1003....）
	 * @returns {any}
	 */
	public getEnumData = function (code) {
		let _this = this;
		if (!_this.enumData.hasOwnProperty(code)) {
			this.ajax.get({
				async: false,
				url: '/res/enum/' + code,
				success: function (result) {
					if (isNullOrUndefined(result)) return ""; else _this.enumData[code] = result;
				}
			});
		}
		return _this.enumData[code];
	}

	/**
	 * 根据类型标示获取枚举list信息
	 * code 类型标示（如：1001、1002、1003....）
	 * @param code
	 * @returns {Array<any>}
	 */
	public getEnumDataList = function (code) {
		let list: Array<any> = new Array<any>();
		let enumInfo = this.getEnumData(code);
		for (var prop in enumInfo) {
			if (enumInfo.hasOwnProperty(prop)) list.push({"key": prop, "val": enumInfo[prop]})
		}
		return list;
	}

	/**
	 * 根据类型标示和key获取信息值
	 * @param code （如：1001、1002、1003....）
	 * @param key （如：ILLNESSCASE、TYPELESS、NURSING....）
	 * @returns {any}
	 */
	public getEnumDataValByKey = function (code, key) {
		var enumData = this.getEnumData(code);
		if (enumData != null && enumData != "" && enumData != undefined) {
			if (enumData[key] != null && enumData[key] != "" && enumData[key] != undefined) return enumData[key];
			else return "";
		} else {
			return "";
		}
	};

	/**
	 * 获取时区信息
	 * @returns {Array<any>}
	 */
	public getTimeZones = function () {
		let _this = this;
		if (_this.timezones.length < 1) {
			_this.ajax.get({
				url: '/res/tz/timezones',
				async: false,
				success: (res) => {
					if (res.success) _this.timezones = res.data;
				}
			});
		}
		return _this.timezones;
	}

	/**
	 * 获取国家代码信息
	 * @returns {Array<any>}
	 */
	public getCountryCode() {
		let _this = this;
		if (_this.countryCode.length < 1) {
			_this.ajax.get({
				url: '/res/area/countries',
				async: false,
				success: (res) => {
					if (res.success) _this.countryCode = res.data;
				}
			});
		}
		return _this.countryCode;
	}

	/**
	 * 检测登录，判断是否登录（不自动跳转登录页面，仅做判断）
	 * @returns {boolean}
	 */
	static ckLogin() {
		return new CookieService().get(SettingsService.sessionId) ? true : false;
	}

	/**
	 * 检测登录状态，若未登录，跳转到登陆页面
	 * @returns {boolean|Promise<boolean>}
	 */
	static checkLogin(back?: boolean) { //true：成功后返回当前页，false或不填写：登录成功后去个人中心页面
		if (back) {
			return new CookieService().get(SettingsService.sessionId) ? true : this.router.navigate(['/pages/login'], {queryParams: {t: "back"}}) && false;
		} else {
			return new CookieService().get(SettingsService.sessionId) ? true : this.router.navigate(['/pages/login']) && false;
		}
	}

	/**
	 * 检测登录拦截，如果是 非拦截 列表中的内容，则放过拦截，非 非拦截 列表中的内容，则进行拦截判断是否登录
	 */
	static checkLoginIntercept(url: string) {
		let ret: boolean = false, list: Array<string> = SettingsService.loginNotIntercept;
		list.forEach((val, idx, array) => {
			if (url.indexOf(val) == 0) ret = true;
		});
		return ret;
	}

	static getJsonByValue(arr: Array<any>, key: string, value: any) {
		let res = null;
		arr.forEach((ele, index) => {
			if (ele[key] === value) res = ele;
		});
		return res;
	}

	/**
	 * 设置顶部菜单选中
	 * @param url
	 */
	public selMenu(url) {
		SettingsService.menu.forEach((val, index, array) => {
			url.indexOf(val.url) == 0 ? val.sel = true : val.sel = false;
		})
	}

	/**
	 * 退出登录
	 * @returns {boolean}
	 */
	logOut() {
		let _this = this, ret: boolean = false;
		_this.ajax.get({
			url: "/login/logout",
			async: false,
			success: (response) => {
				// _this.cookieService.remove('sessionId');    //解决在ie无法退出登录
				ret = response.success;
			}
		});
		return ret;
	}

	/**
	 * 获取学员自定义课时时，选择教师的上限数
	 * @returns {boolean}
	 */
	selectTutorUpperLimitForCustom() {
		let _this = this;
		if (_this.selectTutorUpperLimitForCustomNum < 1) {
			_this.ajax.get({
				url: "/setting/setting/custom/upperlimit",
				async: false,
				success: (response) => {
					_this.selectTutorUpperLimitForCustomNum = response.data;
				}
			})
		}
		return _this.selectTutorUpperLimitForCustomNum;
	}

	/**
	 * 获取国际化信息
	 */
	getI18nInfos(countryCode?: string) {
		let _this = this, browserLang = countryCode || _this.translate.getBrowserLang();
		if (isNullOrUndefined(browserLang) || browserLang == "") browserLang = "en";
		$.get({
			url: "../../../assets/i18n/" + browserLang + ".json",
			async: false,
			success: (response) => {
				SettingsService.I18NINFO = response.ts;
			}
		})
	}

	/************************************************时区时间转换 begin************************************************/
	/**
	 * 当前时区时间转UTC时间
	 * @param date 指定时区的时间，格式YYYY-MM-DD HH:mm:ss 或者 YYYY-MM-DD 等...
	 * @param format 返回的格式化数据，默认 YYYY-MM-DD HH:mm:ss
	 */
	dateToUTC(date?: string,format?: string) {
		if (isNullOrUndefined(format) || format == "") format = "YYYY-MM-DD HH:mm:ss";
		if (isNullOrUndefined(date) || date == "") date = this.dataFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
		let setdate = moment(date);
		return setdate.tz("UTC").format(format);
	}

	/**
	 * 将UTC时间转化为本地时间
	 * @param date UTC时间值,格式YYYY-MM-DD HH:mm:ss 或者 YYYY-MM-DD 等...
	 * @param format 返回的格式化数据，默认 yyyy-MM-dd HH:mm:ss
	 * @constructor
	 */
	UTCToDate(date: string, format?: string) {
		if (isNullOrUndefined(format) || format == "") format = "yyyy-MM-dd HH:mm:ss";
		let _this = this, setdate = moment.tz(date, "UTC"), time = new Date(setdate);
		return _this.dataFormat(time, format);
	}

	/**
	 * 把指定时区的时间转为UTC时间
	 * @param date 指定时区的时间，格式YYYY-MM-DD HH:mm:ss 或者 YYYY-MM-DD 等...
	 * @param timeZone 指定的时区，如：Asia/Shanghai，Asia/Tokyo 等...
	 * @param format 返回的格式化数据，默认 YYYY-MM-DD HH:mm:ss
	 */
	timeZoneDateToUTC(date: string, timeZone: string, format?: string) {
		if (isNullOrUndefined(format) || format == "") format = "YYYY-MM-DD HH:mm:ss";
		let time = moment.tz(date, timeZone);
		return time.tz("UTC").format(format)
	}

	/**
	 * 把UTC时间转为指定时区的时间
	 * @param date UTC的时间，格式YYYY-MM-DD HH:mm:ss 或者 YYYY-MM-DD 等...
	 * @param timeZone 指定的时区，如：Asia/Shanghai，Asia/Tokyo 等...
	 * @param format 返回的格式化数据，默认 YYYY-MM-DD HH:mm:ss
	 */
	UTCToTimeZoneDate(date: string, timeZone: string, format?: string) {
		if (isNullOrUndefined(format) || format == "") format = "YYYY-MM-DD HH:mm:ss";
		let time = moment.tz(date, "UTC");
		return time.tz(timeZone).format(format)
	}


	/**
	 * 指定时区时间转换为指定时区的时间
	 * @param date 指定时区的时间，格式YYYY-MM-DD HH:mm:ss 或者 YYYY-MM-DD 等...
	 * @param timeZone 被转换的时区标志，如：Asia/Shanghai，Asia/Tokyo 等...
	 * @param otherTimeZone 目标时区标志，如：Asia/Shanghai，Asia/Tokyo 等...
	 * @param format 返回的格式化数据，默认 YYYY-MM-DD HH:mm:ss
	 * @returns {string}
	 */
	timeZoneDateToTimeZoneDate(date: string, timeZone: string, otherTimeZone: string, format?: string) {
		if (isNullOrUndefined(format) || format == "") format = "YYYY-MM-DD HH:mm:ss";
		let time = moment.tz(date, timeZone);
		return time.tz(otherTimeZone).format(format)
	}

    /**
     * 获取指定时区的当地时间对象
     * @param timeZone
     */
	localTimeTimeZone(timeZone: string, format?: string){
        if (isNullOrUndefined(format) || format == "") format = "YYYY-MM-DD HH:mm:ss";
	    let utctime= moment.tz(moment().format(format)).tz("UTC").format(format);
        let time = moment.tz(utctime, "UTC");
        if(isNullOrUndefined(timeZone)){
            return moment().format(format)
        }else{
            return time.tz(timeZone);
        }
    }

	// console.log("本地时间转UTC---", _this.tools.dateToUTC()); //本地转UTC
	// console.log("指定的UTC转本地---", _this.tools.UTCToDate("2017-09-21 10:00:00")); //UTC时间转本地时间
	// console.log("指定时区的时间转UTC时间---", _this.tools.timeZoneDateToUTC("2017-09-21 18:00:00", "Asia/Tokyo")); //指定时区的时间转UTC时间
	// console.log("UTC时间转指定时区的时间---", _this.tools.UTCToTimeZoneDate("2017-09-21 10:00:00", "Asia/Tokyo")); //UTC时间转指定时区的时间
	// console.log("指定时区的时间转指定时区的时间---", _this.tools.timeZoneDateToTimeZoneDate("2017-09-21 10:00:00", "Asia/Shanghai","Asia/Tokyo")); //UTC时间转指定时区的时间
	/************************************************时区时间转换 end**************************************************/

	/**
	 * 获取上传文件的uid
	 * @returns {any}
	 */
	uploadUid = function () {
		let _this = this, uid;
		_this.ajax.get({
			url: '/upload/basic/uid',
			async: false,
			success: (res) => {
				if (res.success) uid = res.data;
			}
		});
		return uid;
	}

	/**
	 * 通过对象得到键和值获取对象在数组中
	 * @param arr        被查询的数组
	 * @param key        要获取的键
	 * @param value      要获取的值
	 * @returns {Array<any>}       返回数组
	 */
	getObjectOfArreyByKeyAndValue(arr: Array<any>, key: string, value: any) {
		let result: Array<any> = new Array();
		arr.forEach(ele => {
			if (ele[key] === value) {
				result.push(ele);
			};
		});
		return result;
	}

	/**
	 * 格式化数据为树形结构数据
	 * @param array 需要格式化的数组
	 * @param code 根据key值判断父子级别（code为key名称）
	 * @param parent 制定父级（若指定父级，将获取此级别下的tree信息）
	 * @returns {Array<any>}
	 */
	arrayToTree(array: Array<any>, code: string, parent: string = '') {
		const me = this;
		const list: Array<any> = new Array();
		array.forEach((el, i) => {
			if (el.superCode === parent) {
				const children = me.arrayToTree(array, code, el[code]);
				el.children = children;
				list.push(el);
			}
		});
		return list;
	}

	/**
	 * 获取学生信息
	 * @returns {any}   返回学生信息
	 */
	getStudent = function () {
		let _this = this, result;
		_this.ajax.get({
			url: '/student/get',
			async: false,
			success: (res) => {
				if (res.success) result = res.data;
			}
		});
		return result;
	}

	/**
	 * 获取教师信息
	 * @returns {any}  返回教师信息
	 */
	getTutor = function () {
		let _this = this, result;
		_this.ajax.get({
			url: '/tutor/get',
			async: false,
			success: (res) => {
				if (res.success) result = res.data;
			}
		});
		return result;
	}

	/**
	 * 检测当前登录的是学生还是老师
	 * @returns {string}
	 */
	ckStudentOrTutor(){
		let _this = this,ret:string = null;
		ret = _this.cookie.get(SettingsService.studentLogin);
		if(isNullOrUndefined(ret)) ret = _this.cookie.get(SettingsService.tutorLogin);
		return ret;
	}

}