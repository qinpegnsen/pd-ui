import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {TimetableComponent} from "./timetable/timetable.component";
import {OrderService} from "./order.service";
import {OrderComponent} from './order/order.component';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import {TutorService} from "../tutor/tutor.service";

// 路由信息
const routes: Routes = [
	{
		path: '',
		component: OrderComponent,
		children: [
			{path:'timetable',component:TimetableComponent},
			{path:'confirm',component:OrderConfirmComponent},
			{path:'complete',component:OrderCompleteComponent}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule, // 加载依赖模块
		RouterModule.forChild(routes) // 路由
	],
	declarations: [TimetableComponent, OrderComponent, OrderConfirmComponent, OrderCompleteComponent],
	providers: [OrderService,TutorService],
	exports: [
		RouterModule
	]
})

export class OrderModule {
}
