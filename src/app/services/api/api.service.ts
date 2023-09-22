import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  banners = [
    { banner: 'assets/imgs/1.jpg' },
    { banner: 'assets/imgs/2.jpg' },
    { banner: 'assets/imgs/3.jpg' },
  ];

  restaurants = [
    {
      uid: '1a',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
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
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
  ];

  allRestaurants = [
    {
      uid: '1a',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      cuisines: [
        'Italian',
        'Mexican'
      ],
      rating: 5,
      delivery_time: 25,
      price: 100
    },
    {
      uid: '2a',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: [
        'Italian',
        'Mexican'
      ],
      rating: 5,
      delivery_time: 25,
      price: 100
    },
    {
      uid: '3a',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: [
        'Italian',
        'Mexican'
      ],
      rating: 5,
      delivery_time: 25,
      price: 100
    },
  ];

  restaurants1 = [
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

  constructor() {}
}
