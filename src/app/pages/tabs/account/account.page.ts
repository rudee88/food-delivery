import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { CartService } from '../../../services/cart/cart.service';

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

  constructor(
    private orderService: OrderService,
    private cartService: CartService
    ) {}

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(order => {
      console.log('order data: ', order);
      if (order instanceof Array) {
        this.orders = order;
      } else {
        if (order?.delete) {
          this.orders = this.orders.filter(x => x.id != order.id);
        } else if (order?.update) {
          const index = this.orders.findIndex(x => x.id == order.id);
          this.orders[index] = order;
        } else {
          this.orders = this.orders.concat(order);
        }
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

  async onReorder(order) {
    console.log(order);
    let data: any = await this.cartService.getCart();
    if (data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order)
    }
  }

  onGetHelp(order) {
    console.log(order);
  }

  onLogout() {}

  ngOnDestroy(){
      if (this.ordersSub) this.ordersSub.unsubscribe();
  }
}

