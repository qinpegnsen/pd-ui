import {Injectable} from '@angular/core';

/**
 * 用来定义表单验证的正则表达式
 */
@Injectable()
export class PatternService {
	public num: string; //数字
	public letter: string; //字母
	public phone: string; //手机号
	public idcard: string; //身份证
	public telephone: string; //固话
	public buno: string; //营业执照
	public backcard: string; //银行卡
	public chinese: string; //中文
	public tel: string; // 手机号和固话
	public email: string; // 邮箱正则
	public money: any; //金额
	public phoneOrEmail: string;
	public pnum: string; // 数字

	constructor() {
		this.num = '^[0-9]*$'; //数字正则
		this.pnum = '^[1-9]\\d*|0$'; // 0+正整数正则
		this.letter = '^[A-Za-z]*$'; //字母正则
		this.phone = '^1[0-9]{10}$'; //手机号正则
		this.idcard = '^(^[1-9][0-9]{7}((0[0-9])|(1[0-2]))(([0|1|2][0-9])|3[0-1])[0-9]{3}$)|(^[1-9][0-9]{5}[1-9][0-9]{3}((0[0-9])|(1[0-2]))(([0|1|2][0-9])|3[0-1])(([0-9]{4})|[0-9]{3}[Xx])$)$'; //身份证正则
		this.telephone = '^((^[0-9]{3,4}-[0-9]{7,8}$)|(^[0-9]{7,8}$))$'; //固话正则（支持带区号和不带区号）
		this.buno = '^(([a-zA-Z0-9]{8}-[a-zA-Z0-9])|([a-zA-Z0-9]{18})|([a-zA-Z0-9]{15}))$'; //营业执照正则（三网合一）
		this.backcard = '^([0-9]{16}|[0-9]{19})$'; //银行卡正则（三网合一）
		this.chinese = '^[\u4e00-\u9fa5]{0,}$'; //中文正则（三网合一）
		this.tel = '(^1[0-9]{10}$)|(^((^[0-9]{3,4}-[0-9]{7,8}$)|(^[0-9]{7,8}$))$)'; // 手机号和固话同时验证
		this.email = '^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$'; // 邮箱正则
		this.money = '^([1-9][0-9]{0,9}|0)([.]?|(\.[0-9]{1,2})?)$'; //金额验证，支持小数点后面两位
		this.phoneOrEmail = '(^1[0-9]{10}$)|(^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$)';
	}

}
