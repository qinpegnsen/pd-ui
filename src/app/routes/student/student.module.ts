import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {Routes, RouterModule} from "@angular/router";
import {CourseDetailComponent} from "./course-detail/course-detail.component";
import {CourseCenterComponent} from './course-center/course-center.component';
import {MyCollectionComponent} from './my-collection/my-collection.component';
import {MyOrderComponent} from './my-order/my-order.component';
import {StudentCenterComponent} from './student-center/student-center.component';
import {StudentService} from "./student.service";
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {CustomCourseComponent} from './custom-course/custom-course.component';
import {SearchService} from "../search/search.service";
import {PersonalCenterComponent} from "./personal-center/personal-center.component";
import {OrderService} from "../order/order.service";
import {FeedbackListComponent} from "./feedback-list/feedback-list.component";
import {RegisterTotalComponent} from "./register-total/register-total.component";

// 路由信息
const routes: Routes = [
    {path: 'detail/:code', component: CourseDetailComponent},               // 课堂详情
    {path: 'orderDetail/:code', component: OrderDetailComponent},          // 订单详情
    {path: 'center', component: CourseCenterComponent},                   // 课时中心
    {path: 'feedback/:classroomCode/:tutorCode/:studentCode', component: FeedbackListComponent},//学生回馈评价表
    {path: 'collection', component: MyCollectionComponent},              // 我的收藏
    {path: 'order', component: MyOrderComponent},                       // 我的预约
    {path: 'custom', component: CustomCourseComponent},                // 自定义课程
    {path: '', component: StudentCenterComponent},                     // 学生中心
    {path: 'info', component: PersonalCenterComponent},                     // 个人设置
    // {path: 'register', component: RegisterTotalComponent}                     // 学生注册信息的后续填写
];


@NgModule({
    imports: [
        CommonModule,
        SharedModule, // 加载依赖模块
        RouterModule.forChild(routes), // 路由
    ],
    providers: [StudentService, SearchService, OrderService],
    declarations: [CourseDetailComponent, CourseCenterComponent, MyCollectionComponent, MyOrderComponent, StudentCenterComponent, OrderDetailComponent, CustomCourseComponent, PersonalCenterComponent, FeedbackListComponent]
})
export class StudentModule {
}
