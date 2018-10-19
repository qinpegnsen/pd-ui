import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {SharedModule} from "./shared/shared.module";
import {RoutesModule} from "./routes/routes.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SettingsService} from "./core/settings/settings.service";
import {CoreModule} from "./core/core.module";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {PublicModule} from "./routes/public/public.module";
import {PublicSimpleModule} from "./routes/public/public-simple/public-simple.module";
import {HttpClientModule, HttpClient} from "@angular/common/http";
import {PublicLittleModule} from "./routes/public/public-little/public-little.module";
import {CookieOptions, CookieService} from "angular2-cookie/core";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,    // 浏览器渲染 -- 必需
        RoutesModule,               // 路由
        SharedModule.forRoot(),     //公共模块
        CoreModule,                 //核心模块
        PublicModule,                 //公共模块（头尾）
        HttpClientModule,
        PublicSimpleModule,                //公共模块（头尾-简单的）
        PublicLittleModule,                //公共模块（小的）
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
    ],
    providers: [
        SettingsService,
        CookieService, //Cookie储存
        {provide: CookieOptions, useValue: {} }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

