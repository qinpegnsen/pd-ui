import {NgModule, Optional, SkipSelf} from '@angular/core';
import {SettingsService} from './settings/settings.service';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {RzhtoolsService} from './services/rzhtools.service';
import {PatternService} from './forms/pattern.service';
import {AjaxService} from "./services/ajax.service";
import {MaskService} from "./services/mask.service";

@NgModule({
    imports: [],
    providers: [
        SettingsService,  //全局变量
        RzhtoolsService,  //核心服务
        AjaxService,      //ajax通讯
        MaskService,      //锁屏
        PatternService    //表单验证
    ],
    declarations: [],
    exports: []
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
