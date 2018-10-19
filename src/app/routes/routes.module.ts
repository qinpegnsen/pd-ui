import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {routes} from './routes';
import {CanLoadPokemon, Permissions} from "./canloadmenu";
import {PagesModule} from "./pages/pages.module";
import {CanActivateStudent} from "./can-active-student";
import {CanActivateTutor} from "./can-active-tutor";


@NgModule({
	imports: [
		SharedModule, // 公共模块
		RouterModule.forRoot(routes, {useHash: true}), // 包装路由
		PagesModule
	],
	declarations: [],
	exports: [
		RouterModule
	],
	providers: [CanLoadPokemon, Permissions, CanActivateTutor, CanActivateStudent]
})

export class RoutesModule {
}
