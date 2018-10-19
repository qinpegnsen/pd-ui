import {Component, OnInit} from "@angular/core";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {isNullOrUndefined} from "util";
import {ActivatedRoute} from "@angular/router";
import {SettingsService} from "../../../core/settings/settings.service";
import {PatternService} from "../../../core/forms/pattern.service";
import {AppComponent} from "../../../app.component";
import {Datas, TutorService} from "../tutor.service";
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-set-timetable',
  templateUrl: './set-timetable.component.html',
  styleUrls: ['./set-timetable.component.css']
})

export class SetTimetableComponent implements OnInit {
  valForm: FormGroup; // 表单信息
  dates: Array<string> = new Array(); // 选中的日期信息
  dateInfo: Boolean = true; // 日期提示语
  timeAones: Array<any>; // 时区集合
  timeZoneInfo: string = null; //时区值
  timetableData: Array<Datas> = []; //课表数据源
  tutorList: Array<any>; //教师集合
  courseList: Array<any>; //教师对应的课程集合
  upperClassLimit: Array<number> = new Array(); //学员上限集合
  timeTableTypes: Array<any> = new Array(); //约课状态集合
  courseHourTypeDatas: Array<any> = new Array(); //课时类型集合
  tutorCode: string = ''; //教师编码
  courseHour: number; //需支付课时
  tutorWorktimes: Array<any> = new Array(); //所选择的老师的工作时间段
  weeks: Array<any> = new Array(); //周几集合
  courseCode: string; //选中的课程编码
  duration: number; //课程时长
  num: number; //学员上限
  tutorTimeZone: string; //教师的时区
  tutor: any; //登录的教师
  advanceTime: any; //允许提前排课的时间，（例如 3可以排当前时间3小时的课程）
  public ismeridian: boolean = false; //fasle是24小时制
  public startTime: Date;

  constructor(private routeInfo: ActivatedRoute,public settings: SettingsService, private tools: RzhtoolsService, private tutorService: TutorService,  fb: FormBuilder, private pattern: PatternService) {
    /**
     * 制定课表表单验证
     * @type {FormGroup}
     */
    this.valForm = fb.group({
      'tutorCode': [null], //教师编码
      'courseCode': [null, Validators.required], //课程编码
      'duration': [null, Validators.compose([Validators.required, Validators.pattern(pattern.pnum)])],//时长
      'num': [null, Validators.required], //学员上限
      'courseHour': [null, Validators.compose([Validators.required, Validators.pattern(pattern.pnum)])] //所需课时
      // 'state': [null, Validators.required] //状态
      // 'zones': [null, Validators.required], //时区
      // 'courseHourType': [null, Validators.required] //课时类型
    });
  }

  ngOnInit() {
    let _this = this, num: number;
    _this.tutor = _this.settings.user; //获取当前登录用户的信息
    if(_this.tutor && _this.tutor.timeZone) _this.tutorTimeZone = _this.settings.user.timeZone;
    let firstDate = _this.tools.getAroundDateByDatemoment(_this.tools.localTimeTimeZone(_this.tutorTimeZone), 0);
    // let yesDate = _this.tools.getAroundDateByDate(new Date(), -1);
    _this.advanceTime = _this.tutorService.loadSetting('Advance_Book_Time');
    _this.timetableData = _this.tutorService.timetableDefaultInfos(firstDate);//铺设课表信息
    _this.timeAones = _this.tools.getTimeZones(); //获取时区信息
    _this.tutorList = _this.tutorService.queryTutors(); //获取教师集合
    // num = _this.tools.getUpperClassLimit(); //获取课程学员上限
    // if (!isNullOrUndefined(num) && num > 0) for (let i = 1; i <= num; i++) _this.upperClassLimit.push(i); //封装学员上限集合
    _this.timeTableTypes = _this.tools.getEnumDataList("1004"); //约课状态集合
    _this.courseHourTypeDatas = _this.tools.getEnumDataList("1002"); //约课状态集合
    // _this.courseList = _this.course.coursesactive(); //查询课程列表
    _this.weeks = _this.tools.getEnumDataList("1008"); //周几集合
    //获取路由的参数，设置教师编码
    let code= _this.settings.user.tutorCode;
    if (!isNullOrUndefined(code)) {
      _this.tutorCode = code; //设置教师编码
      _this.selectTutor();
    }

    /**
     * 为了解决input type=tiem在火狐兼容性的问题 ，所以用了ngx-bootstrap的插件，但是24小时制没有默认值显示异常，解决如下
     */
    setTimeout(()=>{
      $('timepicker input').val("")
    },100)

  }

  /**
   * 选择教师
   */
  selectTutor() {
    let _this = this, tutorInfos: any;
    // this.courseHour = 1; //默认需支付1课时
    // _this.timetableData=new Array();
    tutorInfos = _this.tutorService.queryTutorCourse(_this.tutorCode);
    _this.courseList = tutorInfos.tutorCourses || new Array();
    if (!isNullOrUndefined(tutorInfos)) {
      _this.timeZoneInfo = tutorInfos.timeZone; //时区值
      _this.tutorWorktimes = tutorInfos.tutorWorktimes; //设置工作时间段
      _this.weeks = _this.tutorService.setWorktime(_this.weeks, _this.tutorWorktimes); //获取并格式化工作时间
      if (isNullOrUndefined(_this.tutorWorktimes)) _this.tutorWorktimes = new Array();
    }
    _this.drawTimeTable(); //绘制课表
    _this.filterWorks();
  }

  /**
   * 过滤出老师的工作日
   */
  filterWorks() {
    let me = this;

    for (let i = 0; i < me.timetableData.length; i++) {
      me.timetableData[i]['bol'] = false;
    }
    for (let i = 0; i < me.weeks.length; i++) {
      for (let j = 0; j < me.timetableData.length; j++) {
        if (me.weeks[i]['key'] == me.timetableData[j]['week']) {
          if (!isNullOrUndefined(me.weeks[i]['worktime'])) {  //解决一进来直接点击下一周报错的bug
            if (me.weeks[i]['worktime']['length'] == 0) {
              me.timetableData[j]['bol'] = true;//如果符合条件，那么这天不可选
            }
          }
        }
      }
    }
  }

  /**
   * 选择课程
   */
  selectCourse() {
    let _this = this, course: any;
    course = _this.tutorService.getCourse(this.courseCode);
    if (course) {
      _this.duration = course.duration; //时长
      _this.num = course.studentNum; //学员上限
      _this.courseHour = course.courseHour; //消耗课时
    }
  }

  /**
   * 选择课堂时候的提示
   */
  getTip() {
    if(this.courseList.length == 0) {
      AppComponent.rzhAlt('info', SettingsService.I18NINFO.swat.timetable.linkCourse)
    }
  }

  /**
   * 选择日期，封装日期信息
   * @param e 节点
   */
  selDate(e) {
    let t = e.target, val = t.value, checked = t.checked, _this = this;
    if (checked) {
      _this.dates.push(val);
    } else {
      var index = _this.dates.indexOf(val, 0);
      if (index > -1) _this.dates.splice(index, 1);
    }
    if (_this.dates.length < 1) _this.dateInfo = false; else _this.dateInfo = true;
  }

  /**
   * 提交数据信息
   * @param $ev
   * @param value
   */
  submitForm($ev, value: any) {
    value.tutorCode=this.tutorCode;
    let _this = this;
    $ev.preventDefault();
    if(isNullOrUndefined(_this.startTime)){
      _this.tools.rzhAlt('info', SettingsService.I18NINFO.swat.startTime);
      return
    }
    for (let c in _this.valForm.controls) _this.valForm.controls[c].markAsTouched();
    if (_this.dates.length < 1) _this.dateInfo = false; else _this.dateInfo = true;
    if (_this.valForm.valid && _this.dateInfo) {
      for (let cour of _this.courseList) { //设置课程名
        if (cour.course.courseCode == value.courseCode) value.courseName = cour.course.course;
      }
      if (isNullOrUndefined(value.zones)) value.zones = _this.timeZoneInfo;
      let timeTableDatas = _this.tutorService.buildTimeTableInfo(_this.dates, value,_this.startTime ,Number(_this.advanceTime)); //封装课表标准信息数据
      if (timeTableDatas.length > 0) {
        let isTrue = _this.tutorService.addTimeTable(timeTableDatas); //添加课表信息
        _this.drawTimeTable();//绘制课表     失败的时候也刷新页面，因为有可能是助教刚添加上不刷新但不到
      }
      if (timeTableDatas.length < _this.dates.length) {
        _this.tools.rzhAlt('info', SettingsService.I18NINFO.swat.timetable.filter)
      }
    }
  }

  /**
   * 清空表单信息
   */
  clearInfo() {
    let _this = this;
    _this.valForm.reset(); //清空表单信息
    _this.dates = []; //清空日期列表
  }

  /**
   * 删除课表信息
   * @param timetableCode
   */
  delTimeTable(timetableCode) {
    let _this = this;
    swal({
          title: SettingsService.I18NINFO.swat.timetable.delete,
          type: 'info',
          text: SettingsService.I18NINFO.swat.timetable.deleteMsg,
          confirmButtonText: SettingsService.I18NINFO.swat.e121, //‘确认’按钮命名
          showCancelButton: true, //显示‘取消’按钮
          cancelButtonText: SettingsService.I18NINFO.swat.e122, //‘取消’按钮命名
          animation: 'slide-from-top', //头部滑下来
          closeOnConfirm: false  //点击‘确认’后，执行另外一个提示框
        },
        function () {  //点击‘确认’时执行
          swal.close();
          let isTrue = _this.tutorService.delTimeTable(timetableCode);
          if (isTrue) _this.drawTimeTable();//绘制课表
        }
    );
  }

  /**
   * 下一时间段课表
   */
  nextTimeTable() {
    let _this = this, num = _this.timetableData.length - 1; //获取最后一个对象的下标
    _this.dates = []; //清空日期列表
    _this.timetableData = _this.tutorService.timetableDefaultInfos(_this.tools.getAroundDateByDate(new Date(_this.timetableData[num].date), 1));
    _this.drawTimeTable(); //绘制课表
    _this.filterWorks();

  }

  /**
   * 上一时间段课表
   */
  prevTimeTable() {
    let _this = this, num = 0 - (_this.timetableData.length ); //获取向前的天数
    _this.dates = []; //清空日期列表
    let date = _this.tools.getAroundDateByDate(new Date(_this.timetableData[0].date), num); //课表向前翻动，前一个课表的第一天的日期

    if (_this.tools.dateToUnix(_this.tools.dataFormat(date,'yyyy-MM-dd')) < _this.tools.dateToUnix( _this.tools.localTimeTimeZone(_this.tutorTimeZone).format('YYYY-MM-DD'))) return; //课表时间小于当前时间时，不予刷新

    _this.timetableData = _this.tutorService.timetableDefaultInfos(date); //设置课表信息
    _this.drawTimeTable(); //绘制课表
    _this.filterWorks();

  }

  /**
   * 绘制课表
   */
  private drawTimeTable() {
    let _this = this,
        courseData = _this.tutorService.queryTimeTable(_this.tutorCode, _this.timeZoneInfo, _this.timetableData[0].date, _this.timetableData[_this.timetableData.length - 1].date);

    _this.timetableData = _this.tutorService.setTimetableSel(courseData, _this.timetableData); //设置可选择课表信息
  }

}
