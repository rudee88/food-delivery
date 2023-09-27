import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  id: any;
  data: any = {};
  items: any[] = [];
  veg: boolean = false;
  isLoading: boolean;
  cartData: any = {};
  storeData: any = {};
  model = {
    icon: 'fast-food-outline',
    title: 'No Menu Available',
  };
  // restaurants: any[] = [];
  categories: any = [];
  allItems: any[] = [];
  cartSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private api: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      console.log('data: ', paramMap);

      if (!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('restaurantId');
      console.log('id: ', this.id);
      this.getItems();
    });

    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart items: ', cart);
      if (cart) {
        this.storeData = cart;
        if (cart?.restaurant?.uid == this.id) {
          this.allItems.forEach(element => {
            cart.items.forEach(element2 => {
              if (element.id != element2.id) return;
              element.quantity = element2.quantity;
            });
          });
          console.log('allItems: ', this.allItems);
          if (this.veg == true) {
            this.items = this.allItems.filter(x => x.veg === true);
          }
        }
      }
    });
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getItems() {
    try {
      this.isLoading = true;
      this.data = {};
      this.cartData = {};
      this.storeData = {};
      setTimeout(async () => {
        this.categories = this.api.categories;
        this.allItems = this.api.allItems;
        let data = this.api.restaurants1.filter((x) => x.uid === this.id);
        this.data = data[0];
        this.categories = this.categories.filter((x) => x.uid === this.id);
        this.allItems = this.api.allItems.filter((x) => x.uid === this.id);
        this.items = [...this.allItems];
        this.items.forEach((item) => {
          item.quantity = 0;
        });

        console.log('restaurant: ', this.data);

        // const testCart = await this.cartService.getCart(); 
        // console.log('test Cart:', testCart);

        // let cart: any = await this.getCart();
        // console.log('cart: ', cart);
        // if (cart?.value) {
        //   this.storeData = JSON.parse(cart.value);
        //   console.log('storeData: ', this.storeData);
        //   if (
        //     this.id == this.storeData.restaurant.uid &&
        //     this.allItems.length > 0
        //   ) {
        //     this.allItems.forEach((element: any) => {
        //       this.storeData.items.forEach((ele) => {
        //         if (element.id != ele.id) return;
        //         element.quantity = ele.quantity;
        //       });
        //     });
        //   }
        //   this.cartData.totalItem = this.storeData.totalItem;
        //   this.cartData.totalPrice = this.storeData.totalPrice;
        // }
        this.isLoading = false;
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  }

  vegOnly(event) {
    console.log(event.detail.checked);
    this.items = [];
    if (event.detail.checked == true) {
      this.items = this.allItems.filter((x) => x.veg === true);
    } else {
      this.items = this.allItems;
    }
    console.log('items: ', this.items);
  }

  onQuantityPlus(index) {
    this.cartService.quantityPlus(index);
  }

  onQuantityMinus(index) {
    this.cartService.quantityMinus(index);
  }

  async saveToCart() {
    try {
      this.cartData.restaurant = {};
      this.cartData.restaurant = this.data;
      console.log('cartData: ', this.cartData);
      this.cartService.saveCart();
    } catch (e) {
      console.log(e);
    }
  }

  async onViewCart() {
    if (this.cartData.items && this.cartData.items.length > 0) {
      await this.saveToCart();
      console.log('router: ', this.router.url);
    }
    this.router.navigate([this.router.url + '/cart']);
  }
}
