import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  isLoading: boolean;
  profile: any = {};
  orders: any[] = [];
  ordersSub: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(order => {
      console.log('order data: ', order);
      if (order instanceof Array) {
        this.orders = order;
      }
    }, e => {
      console.log(e);
    });
      this.getData();
  }

  async getData() {
    this.isLoading = true;
    setTimeout(async () => {
      this.profile = {
        name: 'Rudy Amri',
        phone: '013-8944432',
        email: 'rudy.amri88@gmail.com',
      };
  
      await this.orderService.getOrders();
      this.isLoading = false;
    },1000);
  }

  onReorder(order) {
    console.log(order);
  }

  onGetHelp(order) {
    console.log(order);
  }

  onLogout() {}

  ngOnDestroy(): void {
      if (this.ordersSub) this.ordersSub.unsubscribe();
  }
}

