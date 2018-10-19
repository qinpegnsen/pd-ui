import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MdButtonModule, MdCheckboxModule, MdSliderModule, MdDatepickerModule, MdNativeDateModule, MdInputModule,
	MdProgressBarModule, MdTabsModule,MdRadioModule
} from '@angular/material';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RouterModule } from "@angular/router";
import { SubstringPipe } from './pipe/substring.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule, TimepickerModule } from "ngx-bootstrap";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
import { StatePipe } from "./pipe/state.pipe";
import { SafePipe } from './pipe/safe.pipe';
import { ToasterModule } from "angular2-toaster";
import { RatingModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { MomentPipe } from './pipe/moment.pipe';
import { QuestionSplitPipe } from './pipe/question-split.pipe';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { VideoSrcPipe } from './pipe/video-src.pipe';
import {DataTableModule} from "./direcrives/ng2-datatable/DataTableModule";
import { CompatibilityModule } from '@angular/material';
@NgModule({
	imports: [                          // 引入
		FormsModule,                     //表单模块 表单必须
		ReactiveFormsModule,             //表单模块
		TranslateModule,
		MdButtonModule,                  //material按钮模块
		MdCheckboxModule,                //material复选框模块
		MdDatepickerModule,              //material日期选择器模块
		MdNativeDateModule,              //material日期选择器模块依赖
		MdSliderModule,                  //material滑块模块
		MdInputModule,                   //material输入框模块
		MdProgressBarModule,             //material进度条模块
		ToasterModule,					 //弹框
		MdTabsModule,
		DataTableModule,
		FileUploadModule,
		ButtonsModule.forRoot(),
		BsDropdownModule.forRoot(),
		TabsModule.forRoot(),
		BsDatepickerModule.forRoot(), //日期模块
		TimepickerModule.forRoot(), //时间模块
		TooltipModule.forRoot(),
		RatingModule.forRoot(),    // bootstrap评分模块
		ModalModule.forRoot(),
		MdRadioModule,
		CompatibilityModule
	],
	providers: [     //提供方

	],
	declarations: [ //声明
		SubstringPipe,
		StatePipe,
		SafePipe,
		SafePipe,
		MomentPipe,
		QuestionSplitPipe,
		SafeHtmlPipe,
		VideoSrcPipe
	],
	exports: [      //对外暴露
		FormsModule,
		ReactiveFormsModule,
		MdButtonModule,
		MdCheckboxModule,
		DataTableModule,
		MdDatepickerModule,
		MdSliderModule,
		MdNativeDateModule,
		MdInputModule,
		MdProgressBarModule,
		MdTabsModule,
		FileUploadModule,
		ButtonsModule,
		BsDropdownModule,
		RouterModule,
		TabsModule,
		SubstringPipe,
		QuestionSplitPipe,
		SafeHtmlPipe,
		StatePipe,
		MomentPipe,
		SafePipe,
		BsDatepickerModule,
		TimepickerModule,
		TooltipModule,
		TranslateModule,
		ToasterModule,
		RatingModule,
		ModalModule,
		MdRadioModule,
		VideoSrcPipe,
		CompatibilityModule
	]
})

/**
 * 初始化装载
 */
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule
		};
	}
}
