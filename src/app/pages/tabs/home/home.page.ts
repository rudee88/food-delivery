import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';

import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  banners: any[] = [];
  restaurants: Restaurant[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub: Subscription;

  constructor(
    private api: ApiService,
    private addressService: AddressService,
    private globalService: GlobalService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe(
      (address) => {
        if (address && address?.lat) {
          if (!this.isLoading) this.isLoading = true;
          this.location = address;
          this.nearbyApiCall(address.lat, address.lng);
        }
      },
      (e) => {
        console.log(e);
        this.isLoading = false;
        this.globalService.errorToast();
      }
    );
    this.getBanners();
    if (!this.location?.lat) {
      this.getNearbyRestaurants();
    }
  }

  getBanners() {
    this.banners = this.api.banners;
  }

  nearbyApiCall(lat, lng) {
    this.restaurants = this.api.restaurants;
  }

  async getNearbyRestaurants() {
    try {
      const position = await this.locationService.getCurrentLocation();
      const { latitude, longitude } = position.coords;
      await this.getData(latitude, longitude);
      console.log('restaurants', this.restaurants);
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      this.searchLocation('home', 'home-modal');
    }
  }

  async getData(lat, lng) {
    try {
      this.restaurants = [];
      await this.nearbyApiCall(lat, lng);
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }

  async searchLocation(prop, className?) {
    try{
      const options = {
        component: SearchLocationComponent,
        cssClass: className ? className : '',
        backdropDismiss: prop === 'select-place' ? true : false,
        componentProps: {
          from: prop,
        },
      }
      const modal = await this.globalService.createModal(options);
      if (modal) {
        if (modal === 'select') {
          this.searchLocation('select-place');
        } else {
          this.location = modal;
          await this.getData(this.location.lat, this.location.lng);
        }
      }
    } catch(e) {
      console.log(e);
    }
  }
}
