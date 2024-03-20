import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { OrderService } from 'src/app/services/order/order.service';
import { CartService } from '../../../services/cart/cart.service';
import { Order } from 'src/app/models/order.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  isLoading: boolean;
  profile: any = {};
  orders: Order[] = [];
  ordersSub: Subscription;
  profileSub: Subscription;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private globalService: GlobalService,
    private profileService: ProfileService
    ) {}

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(order => {
      console.log('order data: ', order);
      this.orders = order;
    }, e => {
      console.log(e);
    });
    this.profileSub = this.profileService.profile.subscribe(profile => {
      this.profile = profile;
      console.log(profile);
    });
      this.getData();
  }

  async getData() {
    this.isLoading = true;
    setTimeout(async () => {
      this.profile = {
        name: 'Rudy Amri',
        phone: '0138944432',
        email: 'rudy.amri88@gmail.com',
      };
  
      await this.orderService.getOrders();
      this.isLoading = false;
    },1000);
  }

  async onReorder(order: Order) {
    console.log(order);
    let data: any = await this.cartService.getCart();
    if (data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order)
    }
  }

  async onEditProfile() {
    const options = {
      component: EditProfileComponent,
      componentProps: {
        profile: this.profile,
      },
      cssClass: 'custom-modal',
      swipeToClose: true,
    };
    const modal = await this.globalService.createModal(options);
  }

  onGetHelp(order) {
    console.log(order);
  }

  onLogout() {}

  ngOnDestroy(){
      if (this.ordersSub) this.ordersSub.unsubscribe();
      if (this.profileSub) this.profileSub.unsubscribe();
  }
}

