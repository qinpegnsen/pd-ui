import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicSimpleComponent } from './public-simple.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {SharedModule} from "../../../shared/shared.module";
import {SidenavComponent} from "./sidenav/sidenav.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  declarations: [PublicSimpleComponent, HeaderComponent, FooterComponent,SidenavComponent],
  exports:[SidenavComponent]
})
export class PublicSimpleModule { }
