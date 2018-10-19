import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-public-simple',
  templateUrl: './public-simple.component.html',
  styleUrls: ['./public-simple.component.css']
})
export class PublicSimpleComponent implements OnInit {
  public slide?: boolean = false;

  constructor() { }

  ngOnInit() {
    $(".content-wrapper").css("min-height",($(window).height()-239)+"px"); //设置内区域，最小高度
  }

  /**
   * 改变sidenav组件显示状态
   */
  slideChange(){
    this.slide = !this.slide;
  }

}
