import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent  implements OnInit {

  @Input() order: Order;
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  @Output() getHelp: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onReorder() {
    this.reorder.emit(this.order);
  }

  onGetHelp() {
    this.getHelp.emit(this.order);
  }

}
