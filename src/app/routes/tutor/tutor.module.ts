import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TutorCenterComponent} from './tutor-center/tutor-center.component';
import {Routes, RouterModule} from '@angular/router';
import { TeachingRecordComponent } from './teaching-record/teaching-record.component';
import {SharedModule} from "../../shared/shared.module";
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { OrderHandleComponent } from './order-handle/order-handle.component';
import {TutorService} from "./tutor.service";
import { TutorTimetableComponent } from './tutor-timetable/tutor-timetable.component';
import {OrderService} from "../order/order.service";
import {PersonalCenterComponent} from "./personal-center/personal-center.component";
import {LookCommentComponent} from "./look-comment/look-comment.component";
import {FeedbackListComponent} from "./feedback-list/feedback-list.component";
import {StudentService} from "../student/student.service";
import {SetTimetableComponent} from "./set-timetable/set-timetable.component";
import { TimepickerModule } from 'ngx-bootstrap';

// 路由信息
const comment: Routes = [
	{path: 'comment/:code', component: LookCommentComponent}    // 评论列表
];
const routes: Routes = [
	{path: '', component: TutorCenterComponent},              // 教师中心
	{path: 'record', component: TeachingRecordComponent},      // 授课记录
	{path: 'detail/:code', component: CourseDetailComponent},     // 课堂详情
	{path: 'timetable', component: TutorTimetableComponent},        // 查看教师课表
	{path: 'set', component: SetTimetableComponent},        // 教师制作课表
	{path: 'info', component: PersonalCenterComponent},           // 预约处理
	{path: 'order', component: OrderHandleComponent,children:comment}, // 预约处理
	{path: 'comment/:code', component: LookCommentComponent},    // 评论列表
	{path: 'feedback/:classroomCode/:tutorCode/:studentCode', component: FeedbackListComponent},//学生回馈评价表
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule, // 加载依赖模块
		RouterModule.forChild(routes), // 路由
		TimepickerModule.forRoot()
	],
	providers: [TutorService, OrderService,StudentService],
	declarations: [TutorCenterComponent,
		TeachingRecordComponent,
		CourseDetailComponent,
		OrderHandleComponent,
		TutorTimetableComponent,
		PersonalCenterComponent,
		FeedbackListComponent,
		LookCommentComponent,
		SetTimetableComponent]
})
export class TutorModule {}
