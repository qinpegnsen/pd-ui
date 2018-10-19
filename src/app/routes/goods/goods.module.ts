import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoodsComponent} from './goods/goods.component';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {PayComponent} from './pay/pay.component';
import {GoodsService} from "./goods.service";

// 路由信息
const routes: Routes = [
	{
		path: '',
		component: GoodsComponent,
		children: [
			{path: 'pay', component: PayComponent} //支付
		]
	},

];

@NgModule({
	imports: [
		CommonModule,
		SharedModule, // 加载依赖模块
		RouterModule.forChild(routes), //路由
	],
	declarations: [GoodsComponent, PayComponent],
	providers:[GoodsService]
})
export class GoodsModule {
}
