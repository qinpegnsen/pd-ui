// 设置路由指向
import {PublicComponent} from "./public/public.component";
import {PublicSimpleComponent} from "./public/public-simple/public-simple.component";
import {PagesComponent} from "./pages/pages/pages.component";
import {LoginComponent} from "./pages/login/login.component";
import {TutorLoginComponent} from "./pages/tutor-login/tutor-login.component";
import {PaySuccessComponent} from "./pages/pay-success/pay-success.component";
import {PayCancelComponent} from "./pages/pay-cancel/pay-cancel.component";
import {TutorInitComponent} from "./pages/tutor-init/tutor-init.component";
import {PublicLittleComponent} from "./public/public-little/public-little.component";
import {CanActivateTutor} from "./can-active-tutor"
import {CanActivateStudent} from "./can-active-student";
import {SendEmailComponent} from "./pages/send-email/send-email.component";
import {ResetPasswordComponent} from "./pages/reset-password/reset-password.component";

export const routes = [
    {
        path: 'manage',
        component: PublicComponent, //登录之后的公共组件
        children: [
            {path: 'tutor', loadChildren: './tutor/tutor.module#TutorModule', canActivate: [CanActivateTutor]},
            {path: 'student', loadChildren: './student/student.module#StudentModule', canActivate: [CanActivateStudent]}
        ]
    },
    {
        path: '',
        component: PublicSimpleComponent, //没有登录之前公共组件或者登录之后预约
        children: [
            {path: '', redirectTo: 'goods', pathMatch: 'full'},       //重定向到goods
            {path: 'goods', loadChildren: './goods/goods.module#GoodsModule'}, //商品模块
            {path: 'search', loadChildren: './search/search.module#SearchModule'}, //搜索模块
            {path: 'order', loadChildren: './order/order.module#OrderModule'} //预定模块
        ]
    },
    {
        path: 'pages',
        component: PagesComponent,  //登录注册的公共组件
        children: [
            {path: '', redirectTo: '/main/home', pathMatch: 'full'},
            {path: 'login', component: LoginComponent},   //学生登录
            {path: 'tutorLogin', component: TutorLoginComponent},  //教师登录
            {path: 'tutorInit', component: TutorInitComponent},    //教师修改密码
            {path: 'paySuccess', component: PaySuccessComponent},
            {path: 'payCancel', component: PayCancelComponent},
            {path: 'send', component: SendEmailComponent}, //发送邮件进行身份确认
            {path: 'resetPass/:code/:id/:role', component: ResetPasswordComponent}  //重置密码
        ]
    },
    {
        path: 'papers',   //课件公共组件
        component: PublicLittleComponent,
        children: [
            {path: 'courseware', loadChildren: './courseware/courseware.module#CoursewareModule'} //课堂课件
        ]
    },
    // 路由指向找不到时，指向这里
    {path: '**', redirectTo: 'goods', pathMatch: 'full'}
];
