import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { Subscription, take } from 'rxjs';

import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit, OnDestroy {
  id: any;
  data = {} as Restaurant;
  items: Item[] = [];
  veg: boolean = false;
  isLoading: boolean;
  cartData: any = {};
  storeData: any = {};
  model = {
    icon: 'fast-food-outline',
    title: 'No Menu Available',
  };
  // restaurants: any[] = [];
  categories: Category[] = [];
  allItems: Item[] = [];
  cartSub: Subscription;
  routeSub: Subscription

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private api: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap) => {
      console.log('data: ', paramMap);

      if (!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('restaurantId');
      console.log('id: ', this.id);
    });

    
      this.cartSub = this.cartService.cart.subscribe((cart) => {
        console.log('cart items: ', cart);
        if (cart && cart?.totalItem > 0) {
          this.cartData = {};
          this.storeData = {};
          if (cart?.restaurant?.uid == this.id) {
            this.storeData = cart;
            this.cartData.totalItem = this.storeData.totalItem;
            this.cartData.totalPrice = this.storeData.totalPrice;
            this.allItems.forEach((element) => {
              cart.items.forEach((element2) => {
                if (element.id != element2.id) return;
                element.quantity = element2.quantity;
              });
            });
            console.log('allItems: ', this.allItems);
            this.cartData.items = this.allItems.filter((x) => x.quantity);
            if (this.veg == true) {
              this.items = this.allItems.filter((x) => x.veg === true);
            } else this.items = [...this.allItems];
          } else {
            this.allItems.forEach((element) => {
              element.quantity = 0;
            });
            if (this.veg == true) {
              this.items = this.allItems.filter((x) => x.veg === true);
            } else this.items = [...this.allItems];
          }
        }
      });
      this.getItems();
    }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getItems() {
    try {
      this.isLoading = true;
      this.data = {} as Restaurant;
      this.cartData = {};
      this.storeData = {};
      setTimeout(async () => {
        this.categories = this.api.categories;
        this.allItems = this.api.allItems;
        let data = this.api.restaurants1.filter((x) => x.uid === this.id);
        this.data = data[0];
        this.categories = this.categories.filter((x) => x.uid === this.id);
        this.allItems = this.api.allItems.filter((x) => x.uid === this.id);
        this.allItems.forEach((element, index) => {
          this.allItems[index].quantity = 0;
        });
        this.items = [...this.allItems];
        this.items.forEach((item) => {
          item.quantity = 0;
        });

        console.log('restaurant: ', this.data);
        await this.cartService.getCartData();

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

  onQuantityPlus(item) {
    const index = this.allItems.findIndex((x) => x.id === item.id);
    console.log('index: ', index);
    if (!this.allItems[index].quantity || this.allItems[index].quantity == 0) {
      if (
        !this.storeData.restaurant ||
        (this.storeData.restaurant && this.storeData.restaurant.uid == this.id)
      ) {
        console.log('index item: ', this.allItems);
        this.cartService.quantityPlus(index, this.allItems, this.data);
      } else {
        //alert for clear cart
        this.cartService.alertClearCart(index, this.allItems, this.data);
      }
    } else {
      this.cartService.quantityPlus(index, this.allItems, this.data);
    }
    console.log('Cart Item: ', this.cartData)
  }

  onQuantityMinus(item) {
    const index = this.allItems.findIndex((x) => x.id === item.id);
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
    console.log('save cartdata:', this.cartData);
    if (this.cartData.items && this.cartData.items.length > 0) {
      await this.saveToCart();
      console.log('router: ', this.router.url);
    }
    this.router.navigate([this.router.url + '/cart']);
  }

  async ionViewWillLeave() {
    console.log('ionViewWillLeave Cart Page');
    if (this.cartData?.item && this.cartData.item.length > 0) {
      await this.saveToCart();
    }
    // if (this.routeSub) this.routeSub.unsubscribe(); // tak perlu sebenarnye sebab dah buat take(1)
  }

  ngOnDestroy(): void {
      if (this.cartSub) this.cartSub.unsubscribe();
  }
}
