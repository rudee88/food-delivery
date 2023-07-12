import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';

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
    title: 'No Menu Available'
  };
  restaurants = [
    {
      uid: '1a',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      address: 'Ampang, Selangor',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
    {
      uid: '2a',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      address: 'Setapak, Kuala Lumpur',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
    {
      uid: '3a',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      address: 'Bangsar, Selangor',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
  ];

  categories: any = [
    {
      id: 'e00',
      name: 'Italian',
      uid: '1a',
    },
    {
      id: 'e0',
      name: 'Mexican',
      uid: '1a',
    },
  ];

  allItems = [
    {
      category_id: 'e00',
      cover:
        'https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*',
      desc: 'Great in taste',
      id: 'i1',
      name: 'pizza',
      price: 30.3,
      rating: 0,
      status: true,
      uid: '1a',
      variation: false,
      veg: false,
    },
    {
      category_id: 'e0',
      cover:
        'https://www.tasteofhome.com/wp-content/uploads/2018/01/Classic-Wilted-Lettuce-Salad_EXPS_FT20_4535_F_0623_1-3.jpg?fit=700,1024',
      desc: 'Great in taste',
      id: 'i2',
      name: 'Caprese Salad',
      price: 20,
      rating: 0,
      status: true,
      uid: '1a',
      variation: false,
      veg: true,
    },
    {
      category_id: 'e00',
      cover:
        'https://www.thecountrycook.net/wp-content/uploads/2023/02/thumbnail-Penne-Pasta-with-Tomato-Sauce-scaled.jpg',
      desc: 'Great in taste',
      id: 'i3',
      name: 'Pasta',
      price: 25,
      rating: 0,
      status: true,
      uid: '1a',
      variation: false,
      veg: false,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router
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
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getItems() {
    this.isLoading = true;
    this.data = {};
    this.cartData = {};
    this.storeData = {};
    setTimeout(async() => {
      let data = this.restaurants.filter((x) => x.uid === this.id);
      this.data = data[0];
      this.categories = this.categories.filter((x) => x.uid === this.id);
      this.items = this.allItems.filter((x) => x.uid === this.id);
  
      this.items.forEach((item) => {
        item.quantity = 0;
      });
  
      console.log('restaurant: ', this.data);
  
      let cart: any = await this.getCart();
      console.log('cart: ', cart);
      if (cart?.value) {
        this.storeData = JSON.parse(cart.value);
        console.log('storeData: ', this.storeData);
        if (this.id == this.storeData.restaurant.uid && this.allItems.length > 0) {
          this.allItems.forEach((element: any) => {
            this.storeData.items.forEach(ele => {
              if (element.id != ele.id) return;
              element.quantity = ele.quantity;
            })
          });
        }
        this.cartData.totalItem = this.storeData.totalItem;
        this.cartData.totalPrice = this.storeData.totalPrice;
      }
      this.isLoading = false;
    },2000);
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
    try {
      console.log(this.items[index]);
      if (!this.items[index] || this.items[index].quantity == 0) {
        this.items[index].quantity = 1;
        this.calculate();
      } else {
        this.items[index].quantity += 1; // this.items[index].quantity = this.items[index].quantity + 1
        this.calculate();
      }
    } catch (e) {}
  }

  onQuantityMinus(index) {
    if (this.items[index].quantity !== 0) {
      this.items[index].quantity -= 1; // this.items[index].quantity = this.items[index].quantity - 1
    } else {
      this.items[index].quantity = 0;
    }
    this.calculate();
  }

  calculate() {
    console.log(this.items);
    this.cartData.items = [];
    let item = this.items.filter((x) => x.quantity > 0);
    console.log('added item:', item);
    this.cartData.items = item;
    this.cartData.totalPrice = 0;
    this.cartData.totalItem = 0;
    item.forEach((element) => {
      this.cartData.totalItem += element.quantity;
      this.cartData.totalPrice +=
        parseFloat(element.price) * parseFloat(element.quantity);
    });
    this.cartData.totalPrice = parseFloat(this.cartData.totalPrice).toFixed(2);
    if (this.cartData.totalItem == 0) {
      this.cartData.totalItem = 0;
      this.cartData.totalPrice = 0;
    }
    console.log('cart: ', this.cartData);
  }

  async saveToCart() {
    try {
      this.cartData.restaurant = {};
      this.cartData.restaurant = this.data;
      console.log('cartData: ', this.cartData);
      await Preferences.set({
        key: 'cart',
        value: JSON.stringify(this.cartData),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async onViewCart() {
    if (this.cartData.items && this.cartData.items.length > 0) {
      await this.saveToCart();
      // this.router.navigate([this.router.url + '/cart']);
    }
  }
}
