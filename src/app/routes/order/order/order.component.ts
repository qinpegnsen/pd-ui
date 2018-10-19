import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  stepConfirm:boolean = false; //用于判断是否处于‘确认’的步骤
  stepOK:boolean = false; //用于判断是否处于‘完成’的步骤

  constructor() { }

  ngOnInit() {
  }
}
