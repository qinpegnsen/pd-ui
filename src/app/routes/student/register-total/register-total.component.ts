import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {AppComponent} from "../../../app.component";
import {MaskService} from "../../../core/services/mask.service";
import {AjaxService} from "../../../core/services/ajax.service";
const swal = require('sweetalert');
@Component({
    selector: 'app-register-total',
    templateUrl: './register-total.component.html',
    styleUrls: ['./register-total.component.css']
})
export class RegisterTotalComponent implements OnInit {
    valForm: FormGroup; // 表单信息
    @Output()
    priceChange: any = new EventEmitter();
    timezones: Array<any> = new Array();
    //下面都是程序文字勿动
    genders: any = [
        'Female',
        'Male',
        'Prefer not to say',
    ];           //性别
    ages: any = [
        'Less than 13',
        '13 to 14',
        '15 to 17',
        '18 to 25',
        'Over 25',
    ];           //年龄
    studys: any = [
        'Yes',
        'No',
    ];           //是否学习
    Status: any = [
        'Middle School',
        'High School',
        'College and above',
        'Professional',
        'Other',
    ];           //状态
    backgrounds: any = [
        'Immersion',
        'Heritage/ Weekend/ After-school',
        'Second Language at school',
        'Private lessons',
        'Other',
    ];           //教学背景
    learnLengths: any = [
        '0',
        '1-2',
        '3',
        '4',
        'More than 4',
    ];           //学习时长
    learnTypes: any = [
        'Simplified Chinese',
        'Traditional Chinese'
    ];           //学习类型
    learnGoals: any = [
        'AP Course',
        'Improve/Learn Chinese',
        'Prepare for TOCFL/HSK exams',
        'Career related',
        'Personal growth',
        'Travel',
        'Other'
    ];           //学习目标方向
    skills: any = [
        'Listening',
        'Speaking',
        'Reading',
        'Writing',
    ];           //提升技能
    plans: any = [
        'Mon-Thurs, 1 hr per day 4:30 pm~5:30 pm (Pacific time zone)',
        'Mon & Wed, 2 hrs per day 4:30 pm~6:30 pm (Pacific time zone)',
        'Tue & Thur, 2 hrs per day 4:30 pm~6:30 pm (Pacific time zone)',
        'Other'
    ];           //学习计划
    exams: any = [
        'Yes',
        'No',
    ];           //课后测验
    wasteTimes: any = [
        'One session per week',
        'Two sessions per week',
        'Three sessions per week',
        'Four sessions per week',
        'More than four sessions per week',
        'Other'
    ];           //学习频率
    hows: any = [
        'Yes',
        'No',
        'Not sure',
    ];           //怎样学习
    sources: any = [
        'School',
        'Teacher',
        'Internet',
        'Advertising',
        'Company website',
        'Conference',
        'Other',
    ];           //怎样学习
    constructor(fb: FormBuilder, private router: Router, public tools: RzhtoolsService, public ajax: AjaxService,) {
        /**
         * 制定课表表单验证
         * @type {FormGroup}
         */
        this.valForm = fb.group({
            'firstName': [null, [Validators.required]], //名字
            'lastName': [null, [Validators.required]], //姓
            'chineseName': [null, [Validators.required]], //中文名字
            'email': [null, [Validators.required, Validators.email]], //邮箱
            'passwordInfo': fb.group({
                'password': [null, [Validators.required]], //密码
                'passwordConfirm': [null, [Validators.required]], //确认密码
            }, {validator: this.posswordValidtor}), //密码
            'timeZone': [null, [Validators.required]], //确认密码
            'nationality': [null, [Validators.required]], //国籍
            'nativeLanguage': [null, [Validators.required]], //母语
            'sex': [null, [Validators.required]], //性别
            'ageRange': [null, [Validators.required]], //年龄
            'guardianName': [null], //监护人的姓名
            'guardianEmail': [null], //监护人的email
            'guardianPhone': [null], //监护人的电话
            'schoolName': [null], //学校
            'currentStatus': [null, [Validators.required]], //状态
            'study': [null, [Validators.required]], //学习
            'eduBackGround': fb.array([
                new FormControl(),
                new FormControl(),
                new FormControl(),
                new FormControl(),
                new FormControl(),
            ]), //学习背景(多选)
            'learningYear': [null], //学习时长
            'wantToLearn': [null, [Validators.required]], //学习类型
            'studyGoal':[null] , //学习目标方向(单选)
            'skills': fb.array([
                new FormControl(),
                new FormControl(),
                new FormControl(),
                new FormControl(),
            ], this.morenOneValidtor), //学习技能(多选)
            'plan': [null], //学习计划
            'currentStatusOther': [null], //当前状态为其他的时候的输入框的内容
            'eduBackGroundOther': [null], //教育背景为其他的时候的输入框的内容
            'isNeedWriteOther': [null], //是否知道怎样学习其他的时候的输入框的内容
            'studyGoalOther': [null], //学习目标为其他的时候的输入框的内容
            'planOther': [null], //计划为其他的时候的输入框的内容
            'underStandWayOther': [null], //从哪里看到的ponddy信息为其他的时候的输入框的内容
            'coachPlanOther': [null], //训练计划为其他的时候的输入框的内容
            'isExam': [null], //课后测验
            'coachPlan': fb.array([
                new FormControl(),
                new FormControl(),
                new FormControl(),
                new FormControl(),
                new FormControl(),
                new FormControl(),
            ]), //花费时长(多选)
            'isNeedWrite': [null, [Validators.required]], //怎么样学习
            'underStandWay': [null, [Validators.required]], //从哪看到
            'promoCode': [null], //优惠码
        });
    }

    ngOnInit() {
        this.timezones = this.tools.getTimeZones();                    // 初始化时区
        this.valForm.get('ageRange').valueChanges
            .subscribe(value => this.checkAgeValue(value));               //年龄
        this.valForm.get('currentStatus').valueChanges
            .subscribe(value => this.checkcurrentStatusValue(value));               //状态
        this.valForm.get('study').valueChanges
            .subscribe(value => this.checkStudyValue(value));               //是否学习过中文
        this.valForm.get('eduBackGround').valueChanges
            .subscribe(value => this.checkeduBackGroundValue(value));               //教育背景
        // this.valForm.get('isNeedWrite').valueChanges
        //     .subscribe(value => this.checkisNeedWriteValue(value));               //是否清楚怎么样学习中文
        this.valForm.get('studyGoal').valueChanges
            .subscribe(value => this.checkStudyGoalValue(value));               //学习目标
        this.valForm.get('plan').valueChanges
            .subscribe(value => this.checkPlanValue(value));               //对ap chinese 的学习计划
        this.valForm.get('coachPlan').valueChanges
            .subscribe(value => this.checkcoachPlanValue(value));               //对For general tutoring, I plan to take 如果是other
    }
    /**
     *对For general tutoring, I plan to take 如果是other
     * @param enableMobile
     */
    checkcoachPlanValue(value: string): void {
        const coachPlanOther = this.valForm.get('coachPlanOther');
        if(this.getBol(this.valForm.get('coachPlan').value)){
            coachPlanOther.setValidators([Validators.required]);
        }else{
            coachPlanOther.clearValidators();
        }
        coachPlanOther.updateValueAndValidity();
    }

    /**
     *对ap chinese 的学习计划
     * @param enableMobile
     */
    checkPlanValue(value: string): void {
        const planOther = this.valForm.get('planOther');
        if(value == "Other"){
            planOther.setValidators([Validators.required]);
        }else{
            planOther.clearValidators();
        }
        planOther.updateValueAndValidity();
    }

    /**
     *学习目标
     * @param enableMobile
     */
    checkStudyGoalValue(value: string): void {
        const plan = this.valForm.get('plan');
        const isExam = this.valForm.get('isExam');
        const coachPlan = this.valForm.get('coachPlan');
        const studyGoalOther = this.valForm.get('studyGoalOther');
        if(value == "AP Course"){
            plan.setValidators([Validators.required]);
            isExam.setValidators([Validators.required]);
        }if(value != "AP Course"){
            coachPlan.setValidators([this.morenOneValidtor]);
        }if(value=='Other'){
            studyGoalOther.setValidators([Validators.required]);
        }else{
            plan.clearValidators();
            isExam.clearValidators();
            coachPlan.clearValidators();
            studyGoalOther.clearValidators();
        }
        plan.updateValueAndValidity();
        isExam.updateValueAndValidity();
        coachPlan.updateValueAndValidity();
        studyGoalOther.updateValueAndValidity();
    }

    /**
     *是否清楚怎么学习
     * @param enableMobile
     */
    checkisNeedWriteValue(value: string): void {
        const isNeedWriteOther = this.valForm.get('isNeedWriteOther');
        if(this.getBol(value == "Other")){
            isNeedWriteOther.setValidators([Validators.required]);
        }else{
            isNeedWriteOther.clearValidators();
        }
        isNeedWriteOther.updateValueAndValidity();
    }

    /**
     *教育背景选择的其他
     * @param enableMobile
     */
    checkeduBackGroundValue(value: string): void {
        const eduBackGroundOther = this.valForm.get('eduBackGroundOther');

        if(this.getBol(this.valForm.get('eduBackGround').value)){
            eduBackGroundOther.setValidators([Validators.required]);
        }else{
            eduBackGroundOther.clearValidators();
        }

        eduBackGroundOther.updateValueAndValidity();
    }

    /**
     *检测年龄的值重新定义校验规则
     * @param enableMobile
     */
    checkAgeValue(value: string): void {
        const guardianName = this.valForm.get('guardianName');
        const guardianEmail = this.valForm.get('guardianEmail');
        const guardianPhone = this.valForm.get('guardianPhone');

        if(value != "18 to 25"&& value != "Over 25"){
            guardianName.setValidators([Validators.required]);
            guardianEmail.setValidators([Validators.required]);
            guardianPhone.setValidators([Validators.required]);
        }else{
            guardianName.clearValidators();
            guardianEmail.clearValidators();
            guardianPhone.clearValidators();
        }

        guardianName.updateValueAndValidity();
        guardianEmail.updateValueAndValidity();
        guardianPhone.updateValueAndValidity();
    }

    /**
     *检测状态的值重新定义校验规则
     * @param enableMobile
     */
    checkcurrentStatusValue(value: string): void {
        const schoolName = this.valForm.get('schoolName');
        const currentStatusOther = this.valForm.get('currentStatusOther');
        if(value != "Professional"&& value != "Other"){
            schoolName.setValidators([Validators.required]);
        }else if(value == "Other"){
            currentStatusOther.setValidators([Validators.required]);
        }else{
            schoolName.clearValidators();
            currentStatusOther.clearValidators();
        }
        schoolName.updateValueAndValidity();
        currentStatusOther.updateValueAndValidity();
    }


    /**
     *检测教育背景的值重新定义校验规则
     * @param enableMobile
     */
    checkStudyValue(value: string): void {
        const eduBackGround = this.valForm.get('eduBackGround');
        const learningYear = this.valForm.get('learningYear');
        if(value == "Yes"){
            eduBackGround.setValidators([this.morenOneValidtor]);
            learningYear.setValidators([Validators.required]);
        }else{
            eduBackGround.clearValidators();
            learningYear.clearValidators();
        }
        eduBackGround.updateValueAndValidity();
        learningYear.updateValueAndValidity();
    }

    /**
     * 确认密码校验器
     */
    posswordValidtor(info) {
        let possword = info.get('password');
        let posswordConfirm = info.get('passwordConfirm');
        let vaild = possword.value === posswordConfirm.value;
        return vaild ? null : {password: true}
    }

    /**
     * 至少选择一个的校验器
     */
    morenOneValidtor(info) {
        let vaild = false;
        info.controls.forEach(control => {
            if (control.value) {
                vaild = true;
            }
        });
        if (vaild) {
            return null;
        } else {
            return {moreOne: true}
        }

    }

    /**
     * 判断多选框的其他有没有被选中(其他都是在最后一个)
     */
    getBol(value) {
        if(value[value.length-1]){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 判断多选框的有没有一个是选中的
     */
    getOneBol(value) {
        for(let i=0;i<value.length;i++){
            if(value[i]){
                return true;
            }
        }
    }

    /**
     * 提交数据信息
     * @param $ev
     * @param value
     */
    submitForm() {
        if (this.valForm.valid) {
            const me = this;
            me.valForm.value.eduBackGround.forEach((value, key) => {
                if (value) {
                    me.valForm.value.eduBackGround[key] = me.backgrounds[key];
                }
            });
            // me.valForm.value.studyGoal.forEach((value, key) => {
            //     if (value) {
            //         me.valForm.value.studyGoal[key] = me.learnGoals[key];
            //     }
            // });
            // me.valForm.value.studyGoal = JSON.stringify(me.valForm.value.studyGoal);
            me.valForm.value.skills.forEach((value, key) => {
                if (value) {
                    me.valForm.value.skills[key] = me.skills[key];
                }
            });
            me.valForm.value.coachPlan.forEach((value, key) => {
                if (value) {
                    me.valForm.value.coachPlan[key] = me.wasteTimes[key];
                }
            });
            me.valForm.value.password = me.valForm.value.passwordInfo.password;
            me.valForm.value.passwordInfo = null;
            delete me.valForm.value.passwordInfo;
            me.valForm.value.currentStatus=me.valForm.value.currentStatus+(me.valForm.value.currentStatusOther?`：${me.valForm.value.currentStatusOther}`:'');
            me.valForm.value.currentStatus=='null'?me.valForm.value.currentStatus=null:me.valForm.value.currentStatus;
            me.valForm.value.eduBackGround[4]=me.valForm.value.eduBackGround[4]+(me.valForm.value.eduBackGroundOther?`：${me.valForm.value.eduBackGroundOther}`:'');
            me.valForm.value.eduBackGround[4]=='null'?me.valForm.value.eduBackGround[4]=null:me.valForm.value.eduBackGround[4]=me.valForm.value.eduBackGround[4];
            me.valForm.value.isNeedWrite=me.valForm.value.isNeedWrite+(me.valForm.value.isNeedWriteOther?`：${me.valForm.value.isNeedWriteOther}`:'');
            me.valForm.value.isNeedWrite=='null'?me.valForm.value.isNeedWrite=null:me.valForm.value.isNeedWrite;
            me.valForm.value.studyGoal=me.valForm.value.studyGoal+(me.valForm.value.studyGoalOther?`：${me.valForm.value.studyGoalOther}`:'');
            me.valForm.value.studyGoal=='null'? me.valForm.value.studyGoal=null: me.valForm.value.studyGoal;
            me.valForm.value.plan=me.valForm.value.plan+(me.valForm.value.planOther?`：${me.valForm.value.planOther}`:'');
            me.valForm.value.plan=='null'? me.valForm.value.plan=null:me.valForm.value.plan;
            me.valForm.value.underStandWay=me.valForm.value.underStandWay+(me.valForm.value.underStandWayOther?`：${me.valForm.value.underStandWayOther}`:'');
            me.valForm.value.underStandWay=='null'? me.valForm.value.underStandWay=null:me.valForm.value.underStandWay;
            me.valForm.value.coachPlan[5]=me.valForm.value.coachPlan[5]+(me.valForm.value.coachPlanOther?`：${me.valForm.value.coachPlanOther}`:'');
            me.valForm.value.coachPlan[5]=='null'? me.valForm.value.coachPlan[5]=null:me.valForm.value.coachPlan[5]=me.valForm.value.coachPlan[5];
            me.valForm.value.eduBackGround = JSON.stringify(me.valForm.value.eduBackGround);
            me.valForm.value.skills = JSON.stringify(me.valForm.value.skills);
            me.valForm.value.coachPlan = JSON.stringify(me.valForm.value.coachPlan);
            MaskService.showMask();
            this.valForm.value.type = 'Personal';
            me.ajax.post({
                url: '/student/signup',
                data: me.valForm.value,
                success: result => {
                    MaskService.hideMask();                                                       // 关闭wait遮罩
                    if (result.success) {
                        AppComponent.rzhAlt("success", SettingsService.I18NINFO.swat.e115, SettingsService.I18NINFO.swat.e251);
                        me.router.navigate(['/pages/login'], {replaceUrl: true});
                        me.valForm.reset();
                        me.priceChange.emit(true);
                    } else {
                        if (result.data.code == 1000) {
                            AppComponent.rzhAlt("error", SettingsService.I18NINFO.swat.e116, SettingsService.I18NINFO.swat.e246);
                        } else {
                            AppComponent.rzhAlt("error", SettingsService.I18NINFO.swat.e116, SettingsService.I18NINFO.swat.e239);
                        }
                    }
                },
                error: result => {
                    swal(SettingsService.I18NINFO.swat.e112, SettingsService.I18NINFO.swat.e114, 'error');
                }
            });
        } else {
            AppComponent.rzhAlt('info', SettingsService.I18NINFO.swat.noTotal);
        }
        ;
    }
}
