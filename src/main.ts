import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import '../node_modules/hammerjs';   //material依赖手势操作
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
