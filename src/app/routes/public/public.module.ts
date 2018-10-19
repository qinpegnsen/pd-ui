import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PublicComponent } from './public.component';
import {SharedModule} from "../../shared/shared.module";
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  declarations: [FooterComponent, HeaderComponent, PublicComponent, SidenavComponent]
})
export class PublicModule { }
