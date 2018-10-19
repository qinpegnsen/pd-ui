import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { TutorDetailsComponent } from './tutor-details/tutor-details.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { SearchService } from "./search.service";
import { TutorService } from "../tutor/tutor.service";
import { StudentService } from "../student/student.service";

// 路由信息
const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  { path: 'details', component: TutorDetailsComponent } //老师详情
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), //路由
  ],
  declarations: [SearchComponent, TutorDetailsComponent],
  providers: [SearchService, TutorService, StudentService]
})
export class SearchModule { }
