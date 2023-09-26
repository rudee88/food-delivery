import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders = new BehaviorSubject<any>(null);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(private api: ApiService) {}

  getOrders() {
    try {
      const orders = this.api.orders;
      console.log('orders: ', orders);
      this._orders.next(orders);
    } catch (e) {
      throw(e);
    }
  }

  placeOrder(param) {
    try {
      param.user_id = '1';
      param.order = JSON.parse(param.order);
      param.id = 'cLQdnS8YXk5HTDfM3UEC';
      this._orders.next(param);
    } catch (e) {
      throw(e);
    }
  }
  
}
