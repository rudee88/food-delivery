import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { AddressService } from 'src/app/services/address/address.service';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  urlCheck: any;
  url: any;
  model = {} as Cart;
  deliveryCharge = 20;
  instruction: any;
  location = {} as Address;
  cartSub: Subscription;
  addressSub: Subscription;

  constructor(
    private router: Router, 
    private orderService: OrderService,
    private navCtrl: NavController,
    private globalService: GlobalService,
    private cartService: CartService,
    private addressService: AddressService
    ) { }

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe(address => {
      console.log('new address: ', address);
      this.location = address;
    });
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart page: ', cart);
      this.model = cart;
      if (!this.model) this.location = {} as Address;
      console.log('cart page model: ', this.model);
    });
    this.getData();
  }

  async getData() {
    await this.checkUrl;
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
    let url: any;
    if (this.urlCheck == 'tabs') {
      url = ['/', 'tabs', 'address', 'edit-address'];
    } else {
      url = [this.router.url, 'address', 'edit-address'];
    }
    this.router.navigate(url);
  }


  async onChangeAddress() {
    try {
      const options = {
        component: SearchLocationComponent,
        swipteToClose: true,
        cssClass: 'custom-modal',
        componentProps: {
          from: 'cart'
        }
      }
      const address = await this.globalService.createModal(options);
      if (address) {
        if (address === 'add') return this.onAddAddress();
        await this.addressService.changeAddress(address);
      }
    } catch(e) {
      console.log(e);
    }
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

  ngOnDestroy(): void {
      console.log('Destroy CartPage');
      if (this.addressSub) this.addressSub.unsubscribe();
      if (this.cartSub) this.cartSub.unsubscribe();
  }

}
