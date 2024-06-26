import { Injectable } from '@angular/core';

import { Restaurant } from './../../models/restaurant.model';
import { Address } from './../../models/address.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // banners = [
  //   { banner: 'assets/imgs/1.jpg' },
  //   { banner: 'assets/imgs/2.jpg' },
  //   { banner: 'assets/imgs/3.jpg' },
  // ];

  restaurants: Restaurant[] = [
    {
      uid: '12wefdss',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
      latitude: 3.1448499743415494,
      longitude: 101.7689672668845,
    },
    {
      uid: '12wefdefsdss',
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
      uid: '12wefdssrete',
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

  allRestaurants: Restaurant[] = [
    {
      uid: '12wefdss',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 100,
      latitude: 3.1448499743415494,
      longitude: 101.7689672668845,
    },
    {
      uid: '12wefdefsdss',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 100,
    },
    {
      uid: '12wefdssrete',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 100,
    },
  ];

  restaurants1: Restaurant[] = [
    {
      uid: '12wefdss',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      address: 'Karol Bagh, New Delhi',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
      latitude: 3.1448499743415494,
      longitude: 101.7689672668845,
    },
    {
      uid: '12wefdefsdss',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      address: 'Karol Bagh, New Delhi',
      distance: 2.5,
      price: 100,
    },
    {
      uid: '12wefdssrete',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      address: 'Karol Bagh, New Delhi',
      distance: 2.5,
      price: 100,
    },
  ];

  categories: Category[] = [
    {
      id: 'e0',
      name: 'Mexican',
      uid: '12wefdefsdss',
    },
    {
      id: 'e00',
      name: 'Italian',
      uid: '12wefdss',
    },
    {
      id: 'e0',
      name: 'Mexican',
      uid: '12wefdss',
    },
  ];

  allItems: Item[] = [
    {
      category_id: 'e0',
      cover: 'assets/imgs/1.jpg',
      desc: 'Great in taste',
      id: 'i2',
      name: 'Caprese Salad',
      price: 200,
      rating: 0,
      status: true,
      uid: '12wefdefsdss',
      variation: false,
      veg: true,
    },
    {
      category_id: 'e00',
      cover: 'assets/imgs/2.jpg',
      desc: 'Great in taste',
      id: 'i1',
      name: 'Pizza',
      price: 120,
      rating: 0,
      status: true,
      uid: '12wefdss',
      variation: false,
      veg: false,
    },
    {
      category_id: 'e0',
      cover: 'assets/imgs/1.jpg',
      desc: 'Great in taste',
      id: 'i2',
      name: 'Caprese Salad',
      price: 200,
      rating: 0,
      status: true,
      uid: '12wefdss',
      variation: false,
      veg: true,
    },
    {
      category_id: 'e00',
      cover: 'assets/imgs/3.jpg',
      desc: 'Great in taste',
      id: 'i3',
      name: 'Pasta',
      price: 150.5,
      rating: 0,
      status: true,
      uid: '12wefdss',
      variation: false,
      veg: false,
    },
  ];

  addresses: Address[] = [
    {
      address: 'Fancy Bazaar, India',
      house: '2nd Floor',
      id: '7Kox63KlggTvV7ebRKar',
      landmark: 'Fancy Bazar',
      lat: 26.1830738,
      lng: 91.74049769999999,
      title: 'Fancy',
      user_id: '1',
    },
    {
      address: 'Kanuat palace, India',
      house: 'Ground Floor',
      id: '8Kox63KlggTvV7ebRKar',
      landmark: 'Bazar',
      lat: 26.1830738,
      lng: 91.74049769999999,
      title: 'Work',
      user_id: '1',
    },
    {
      address: 'Ampang, Selangor',
      house: 'Ground Floor',
      id: '8Kox63KlggTvV7ebRK1r',
      landmark: '30A, Jalan 2/4',
      lat: 3.1448499743415494,
      lng: 101.7689672668845,
      title: 'Ampang',
      user_id: '1',
    },
  ];

  orders: Order[] = [
    {
      address: {
        address: 'Indira Nagar Rd, Borsojai, Basistha 781029, India',
        house: 'dsgd',
        id: 'cLQdnS8YXk5HTDfM3UQC',
        landmark: 'fdgs',
        lat: 26.108991978867923,
        lng: 91.79069981213378,
        title: 'yui',
        user_id: '1',
      },
      deliveryCharge: 20,
      grandTotal: 540.0,
      id: '5aG0RsPuze8NX00B7uRP',
      order: [
        {
          category_id: 'e0',
          cover: 'assets/imgs/salad.jpg',
          desc: 'Great in taste',
          id: 'i2',
          name: 'Caprese Salad',
          price: 200,
          rating: 0,
          status: true,
          uid: '12wefdefsdss',
          variation: false,
          veg: true,
          quantity: 1,
        },
      ],
      paid: 'COD',
      restaurant:
        // {address: "Christan Basti, India",  city: "909090567", closeTime: "21:00", cover: "", cuisines: ["Caribbean food", "North Indian", "Vietnamese"], delivery_time: 25, description: "dd", email: "DosaPlaza@gmail.com", latitude: 26.1286243, longitude: 91.8012675, uid: "12wefdefsdss", isClose: true, name: "DosaPlaza", openTime: "07:00", phone: 6619563867, price: 27, rating: 4.7, short_name: "stayfit", status: "open", totalRating: 13},
        {
          uid: '12wefdefsdss',
          cover: 'assets/imgs/2.jpg',
          name: 'Stayfit1',
          short_name: 'stayfit1',
          cuisines: ['Italian', 'Mexican'],
          rating: 5,
          delivery_time: 25,
          distance: 2.5,
          price: 100,
        },
      restaurant_id: '12wefdefsdss',
      status: 'created',
      time: 'Jul 6, 2020 11:44 AM',
      total: 520.0,
      user_id: '1',
    },
    {
      address: {
        address: 'Indira Nagar Rd, Borsojai, Basistha 781029, India',
        house: 'dsgd',
        id: 'cLQdnS8YXk5HTDfM3UQC',
        landmark: 'fdgs',
        lat: 26.108991978867923,
        lng: 91.79069981213378,
        title: 'yui',
        user_id: '1',
      },
      deliveryCharge: 20,
      grandTotal: 440.0,
      id: '5aG0RsPuze8NX00B7uR1',
      order: [
        {
          category_id: 'e00',
          cover: 'assets/imgs/2.jpg',
          desc: 'Great in taste',
          id: 'i1',
          name: 'Pizza',
          price: 120,
          quantity: 1,
          rating: 0,
          status: true,
          uid: '12wefdss',
          variation: false,
          veg: false,
        },
        {
          category_id: 'e00',
          cover: 'assets/imgs/1.jpg',
          desc: 'Great in taste',
          id: 'i3',
          name: 'Pasta',
          price: 150,
          quantity: 2,
          rating: 0,
          status: true,
          uid: '12wefdss',
          variation: false,
          veg: false,
        },
      ],
      paid: 'COD',
      restaurant: {
        address: 'Beltola Tiniali, India',
        city: '909090271',
        closeTime: '20:00',
        cover: 'assets/imgs/1.jpg',
        cuisines: ['Italian', 'Mexican'],
        delivery_time: 25,
        description: 'dd',
        email: 'stay@fit.com',
        uid: '12wefdss',
        isClose: true,
        latitude: 26.1286243,
        longitude: 91.8012675,
        name: 'Stayfit',
        openTime: '08:00',
        phone: 6786745745,
        price: 25,
        rating: 0,
        short_name: 'stayfit',
        status: 'open',
        totalRating: 0,
      },
      restaurant_id: '12wefdss',
      status: 'Delivered',
      time: 'Jul 7, 2020 11:44 AM',
      total: 420.0,
      user_id: '1',
    },
  ];

  constructor(private http: HttpClient) {}

  get(url, data?) {
    // data = new HttpParams({
    //   fromObject: data
    // })
    return this.http
      .get<any>(environment.serverBaseUrl + url, { params: data })
      .toPromise();
  }

  post(url, data, formData = false) {
    if (!formData) {
      data = new HttpParams({
        fromObject: data,
      });
    }
    return this.http
      .post<any>(environment.serverBaseUrl + url, data)
      .toPromise();
  }

  patch(url, data, formData = false) {
    if (!formData) {
      data = new HttpParams({
        fromObject: data,
      });
    }
    return this.http
      .patch<any>(environment.serverBaseUrl + url, data)
      .toPromise();
  }
}
