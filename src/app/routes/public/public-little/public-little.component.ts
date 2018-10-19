import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-little',
  templateUrl: './public-little.component.html',
  styleUrls: ['./public-little.component.css']
})
export class PublicLittleComponent implements OnInit {
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
