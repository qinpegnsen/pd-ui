import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {SharedModule} from "../../../shared/shared.module";
import {PublicLittleComponent} from "./public-little.component";
import {PublicSimpleModule} from "../public-simple/public-simple.module";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    PublicSimpleModule
  ],
  declarations: [HeaderComponent, PublicLittleComponent]
})
export class PublicLittleModule { }
