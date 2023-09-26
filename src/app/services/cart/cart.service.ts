import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  model: any = {};
  deliveryCharge = 20;
  private _cart = new BehaviorSubject<any>(null);

  get cart() {
    return this._cart.asObservable();
  }

  constructor() { }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getCartData() {
    let data: any = await this.getCart();
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      console.log('data: ', this.model);
      this.calculate();
    }
  }

  quantityPlus(index) {
    try {
      console.log(this.model.items[index]);
      if (!this.model.items[index] || this.model.items[index].quantity == 0) {
        this.model.items[index].quantity = 1;
      } else {
        this.model.items[index].quantity += 1; // this.items[index].quantity = this.items[index].quantity + 1
      }
      this.calculate();
    } catch (e) {
      console.log(e);
    }
  }

  quantityMinus(index) {
    if (this.model.items[index].quantity !== 0) {
      this.model.items[index].quantity -= 1; // this.model.items[index].quantity = this.model.items[index].quantity - 1
    } else {
      this.model.items[index].quantity = 0;
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

  }
 
}
