import { Component, OnInit } from '@angular/core';
import {RzhtoolsService} from "../../../core/services/rzhtools.service";

@Component({
  selector: 'app-pay-success',
  templateUrl: './pay-success.component.html',
  styleUrls: ['./pay-success.component.css']
})
export class PaySuccessComponent implements OnInit {

  constructor(public tools:RzhtoolsService) { }

  ngOnInit() {
  }

  /**
   * 选择菜单按钮
   * @param url 菜单信息
   */
  selMenu(url: any) {
    this.tools.selMenu(url); //顶部菜单选中
  }

}
