import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {

  public slide?: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  /**
   * 改变sidenav组件显示状态
   */
  slideChange(){
    this.slide = !this.slide;
  }

}
