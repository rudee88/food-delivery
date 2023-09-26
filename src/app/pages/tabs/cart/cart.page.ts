import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';

import { OrderService } from '../../../services/order/order.service';
import { GlobalService } from './../../../services/global/global.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  urlCheck: any;
  url: any;
  model: any = {};
  deliveryCharge = 20;
  instruction: any;
  location: any = {};

  constructor(
    private router: Router, 
    private orderService: OrderService,
    private navCtrl: NavController,
    private globalService: GlobalService
    ) { }

  ngOnInit() {
    this.checkUrl();
    this.getModel();
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getModel() {
    let data: any = await this.getCart();
    this.location = {
      lat: 3.143043190411341, 
      lng: 101.76289370565321,
      address: 'Ampang, Selangor'
    }
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      console.log('data: ', this.model);
      this.calculate();
    }
  }

  async calculate() {
    let item = this.model.items.filter(x => x.quantity > 0);
    this.model.items = item;
    this.model.totalPrice = 0;
    this.model.totalItem = 0;
    this.model.deliveryCharge = 0;
    this.model.grandTotal = 0;

    item.forEach((element) => {
      this.model.totalItem += element.quantity;
      this.model.totalPrice +=
        parseFloat(element.price) * parseFloat(element.quantity);
    });
    this.model.deliveryCharge = this.deliveryCharge;
    this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
    this.model.grandTotal = (parseFloat(this.model.totalPrice) + parseFloat(this.model.deliveryCharge)).toFixed(2);
    if (this.model.totalItem == 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = null;
    }
    console.log('cart: ', this.model);
  }

  clearCart() {
    return Preferences.remove({key: 'cart'});
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
    if (this.model.items[index].quantity !== 0) {
      this.model.items[index].quantity -= 1; // this.model.items[index].quantity = this.model.items[index].quantity - 1
    } else {
      this.model.items[index].quantity = 0;
    }
    this.calculate();
  }
 
  onQuantityPlus(index) {
    try {
      console.log(this.model.items[index]);
      if (!this.model.items[index] || this.model.items[index].quantity == 0) {
        this.model.items[index].quantity = 1;
        this.calculate();
      } else {
        this.model.items[index].quantity += 1; // this.items[index].quantity = this.items[index].quantity + 1
        this.calculate();
      }
    } catch (e) {}
  }

  onAddAddress() {

  }

  onChangeAddress() {
    
  }

  async onMakePayment() {
    try {
      const data = {
        restaurant_id: this.model.restaurant.uid,
        res: this.model.restaurant,
        order: JSON.stringify(this.model.items),
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
      this.clearCart();
      this.globalService.successToast('Your Order is Placed Successfully');
      this.navCtrl.navigateRoot(['tabs/account']);
    } catch(e) {
      console.log(e);
    }
  }

  onScrollToBottom() {
    this.content.scrollToBottom(500);
  }

}
