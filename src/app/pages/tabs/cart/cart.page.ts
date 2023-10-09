import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';

import { CartService } from './../../../services/cart/cart.service';
import { OrderService } from '../../../services/order/order.service';
import { GlobalService } from './../../../services/global/global.service';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { Cart } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  urlCheck: any;
  url: any;
  model = {} as Cart;
  deliveryCharge = 20;
  instruction: any;
  location = {} as Address;
  cartSub: Subscription;

  constructor(
    private router: Router, 
    private orderService: OrderService,
    private navCtrl: NavController,
    private globalService: GlobalService,
    private cartService: CartService,
    ) { }

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart page: ', cart);
      this.model = cart;
      if (!this.model) this.location = {} as Address;
      console.log('cart page model: ', this.model);
    });
    this.checkUrl();
    this.getData();
  }

  async getData() {
    await this.checkUrl;
    // this.location = {
    //   lat: 3.143043190411341, 
    //   lng: 101.76289370565321,
    //   address: 'Ampang, Selangor'
    // }
    this.location = new Address(
      'address1',
      'user1',
      'Address 1',
      'Bandar Baru Ampang',
      'Jalan Wawasan 2/4',
      '30A',
      101.76289370565321,
      101.76289370565321
    );
    await this.cartService.getCartData();
  }

  checkUrl() {
    let url: any = (this.router.url).split('/');
    console.log('url: ', url);
    const spliced = url.splice(url.length - 2, 2)
    this.urlCheck = spliced[0];
    console.log('urlCheck: ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {{
    return this.url.join('/');
  }}

  onQuantityMinus(index) {
    this.cartService.quantityMinus(index);
  }
 
  onQuantityPlus(index) {
    this.cartService.quantityPlus(index);
  }

  onAddAddress() {

  }

  onChangeAddress() {
    
  }

  async onMakePayment() {
    try {
      const data: Order = {
        restaurant_id: this.model.restaurant.uid,
        instruction: this.instruction ? this.instruction : '',
        restaurant: this.model.restaurant,
        // order: JSON.stringify(this.model.items),
        order: (this.model.items),
        time: moment().format('lll'),
        address: this.location,
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD'
      };
      console.log('order: ', data);
      await this.orderService.placeOrder(data);
      //clear cart
      this.cartService.clearCart();
      this.model = {} as Cart;
      this.globalService.successToast('Your Order is Placed Successfully');
      this.navCtrl.navigateRoot(['tabs/account']);
    } catch(e) {
      console.log(e);
    }
  }

  onScrollToBottom() {
    this.content.scrollToBottom(500);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave Cart Page');
    if (this.model?.items && this.model.items.length > 0) {
      this.cartService.saveCart();
    }
  }

}
