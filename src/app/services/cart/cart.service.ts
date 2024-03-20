import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { StorageService } from '../storage/storage.service';
import { GlobalService } from '../global/global.service';
import { Cart } from 'src/app/models/cart.model';
import { Item } from 'src/app/models/item.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  model = {} as Cart;
  deliveryCharge = 20;
  private _cart = new BehaviorSubject<Cart>(null);

  get cart() {
    return this._cart.asObservable();
  }

  constructor(
    private storageService: StorageService,
    private globalService: GlobalService,
    private router: Router
  ) {}

  getCart() {
    return this.storageService.getStorage('cart');
  }

  async getCartData(val?) {
    let data: any = await this.getCart();
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      console.log('data: ', this.model);
      await this.calculate();
      if (!val) this._cart.next(this.model);
    }
  }

  alertClearCart(index, items, data?, order?) {
    this.globalService.showAlert(
      order
        ? 'Would you like to reset your cart before re-ordering from this restaurant?'
        : 'Your cart contain items from a different restaurant. Would you like to reset your cart before browsing a restaurant?',
      'Items already in cart',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return;
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.clearCart();
            this.model = {} as Cart;
            if (order) {
              this.orderToCart(order);
            } else this.quantityPlus(index, items, data);
          },
        },
      ]
    );
  }

  async orderToCart(order: Order) {
    console.log('reorder:', order);
    const data = {
      restaurant: order.restaurant,
      items: order.order,
    };
    this.model = data;
    await this.calculate();
    this.saveCart();
    console.log('model: ', this.model);
    this._cart.next(this.model);
    this.router.navigate(['/', 'tabs', 'restaurants', order.restaurant.uid]);
  }

  async quantityPlus(index, items?: Item[], restaurant?: Restaurant) {
    try {
      if (items) {
        console.log('model: ', this.model);
        this.model.items = [...items];
      }
      if (restaurant) {
        // this.model.restaurant = {};
        this.model.restaurant = restaurant;
      }
      console.log('q plus: ', this.model.items[index]);
      // this.model.items[index].quantity += 1;
      if (
        !this.model.items[index].quantity ||
        this.model.items[index].quantity == 0
      ) {
        this.model.items[index].quantity = 1;
      } else {
        this.model.items[index].quantity += 1; // this.model.items[index].quantity = this.model.items[index].quantity + 1
      }
      await this.calculate();
      this._cart.next(this.model);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async quantityMinus(index, items?: Item[]) {
    try {
      if (items) {
        console.log('model: ', this.model);
        this.model.items = [...items];
      }
      if (
        this.model.items[index].quantity &&
        this.model.items[index].quantity !== 0
      ) {
        this.model.items[index].quantity -= 1; // this.model.items[index].quantity = this.model.items[index].quantity - 1
      } else {
        this.model.items[index].quantity = 0;
      }
      await this.calculate();
      this._cart.next(this.model);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async calculate() {
    let item = this.model.items.filter((x) => x.quantity > 0);
    this.model.items = item;
    this.model.totalPrice = 0;
    this.model.totalItem = 0;
    this.model.deliveryCharge = 0;
    this.model.grandTotal = 0;

    item.forEach((element) => {
      this.model.totalItem += element.quantity;
      this.model.totalPrice +=
        // parseFloat(element.price) * parseFloat(element.quantity);
        element.price * element.quantity;
    });
    this.model.deliveryCharge = this.deliveryCharge;
    // this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
    // this.model.grandTotal = (
    //   parseFloat(this.model.totalPrice) + parseFloat(this.model.deliveryCharge)
    // ).toFixed(2);
    this.model.grandTotal = this.model.totalPrice + this.model.deliveryCharge;
    if (this.model.totalItem == 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = {} as Cart;
    }
    console.log('cart: ', this.model);
  }

  async clearCart() {
    this.globalService.showLoader();
    await this.storageService.removeStorage('cart');
    this._cart.next(null);
    this.globalService.hideLoader();
  }

  saveCart(model?) {
    if (model) this.model = model;
    this.storageService.setStorage('cart', JSON.stringify(this.model));
    // this._cart.next(this.model);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2) {
    let radius = 6371; //radius of earth in km
    let lat = this.deg2rad(lat2 - lat1);
    let lng = this.deg2rad(lng2 - lng1);

    let result =
      Math.sin(lat / 2) * Math.sin(lat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(lng / 2) *
        Math.sin(lng / 2);
    var c = 2 * Math.atan2(Math.sqrt(result), Math.sqrt(1 - result));
    var d = radius * c; // Distance in km
    return d;
  }

  async checkCart(lat1, lng1, radius) {
    let distance: number;
    // if (this.model?.restaurant) {
    //   distance = this.getDistanceFromLatLngInKm(lat1, lng1, this.model.restaurant.latitude, this.model.restaurant.longitude);
    // } else {
    //   await this.getCartData(1);
    //   distance = this.getDistanceFromLatLngInKm(lat1, lng1, this.model.restaurant.latitude, this.model.restaurant.longitude);
    // }

    await this.getCartData(1);
    if (this.model?.restaurant) {
      distance = this.getDistanceFromLatLngInKm(lat1, lng1, this.model.restaurant.latitude, this.model.restaurant.longitude);
      console.log('distance: ', distance);
      if (distance > radius) {
        return true
      } else return false;
    } else return false;
  }
}
