import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {CoursewareComponent} from "./courseware/courseware.component";
import {CoursewareService} from "./courseware.service";
import {TutorService} from "../tutor/tutor.service";

// 路由信息
const routes: Routes = [
	{path: '', component: CoursewareComponent}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule, // 加载依赖模块
		RouterModule.forChild(routes), //路由
	],
	declarations: [CoursewareComponent],
	providers: [CoursewareService, TutorService]
})
export class CoursewareModule {
}
