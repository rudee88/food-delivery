import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';

import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

interface AddressResponse {
  address_components: {
    short_name: string;
  }[];
  formatted_address: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  banners: any[] = [];
  restaurants: Restaurant[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub: Subscription;

  constructor(
    private api: ApiService,
    private addressService: AddressService,
    private globalService: GlobalService,
    private locationService: LocationService,
    private router: Router,
    private mapService: GoogleMapsService
  ) {}

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe(
      (address) => {
        console.log('address: ', address);
        if (address && address?.lat) {
          if (!this.isLoading) this.isLoading = true;
          this.location = address;
          // this.nearbyApiCall(address.lat, address.lng);
          this.nearbyApiCall();
        } else {
          if (address && (!this.location || !this.location?.lat)) {
            this.searchLocation('home', 'home-modal');
          }
        }
        this.isLoading = false;
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

  ionViewWillEnter() {
    console.log('ionWillEnter');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  getBanners() {
    this.banners = this.api.banners;
  }

  nearbyApiCall() {
    console.log(this.location);
    this.isLoading = false;
    this.restaurants = this.api.restaurants;
  }

  async getNearbyRestaurants() {
    try {
      const position = await this.locationService.getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const address: AddressResponse = await this.mapService.getAddress(latitude, longitude) as AddressResponse;
      if (address) {
        this.location = new Address(
          '',
          '',
          address.address_components[0].short_name,
          address.formatted_address,
          '',
          '',
          latitude,
          longitude
        );
        await this.getData();
      }
      console.log('restaurants', this.restaurants);
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      this.searchLocation('home', 'home-modal');
    }
  }

  async getData() {
    try {
      this.restaurants = [];
      // const address = this.addressService.checkExistAddress(lat, lng, this.location);
      const address = this.addressService.checkExistAddress(this.location);
      console.log('address exist: ', address);
      //  await this.nearbyApiCall(lat, lng);
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
        if (modal === 'add') {
          this.addAddress(this.location);
        }else if (modal === 'select') {
          this.searchLocation('select-place');
        } else {
          this.location = modal;
          await this.getData();
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  addAddress(val?) {
    let navData: NavigationExtras;
    if (val) {
      val.from = 'home';
    } else {
      val = {
        from: 'home'
      };
    }
    navData = {
      queryParams: {
        data: JSON.stringify(val)
      }
    };
    this.router.navigate(['/', 'tabs', 'address', 'edit-address']);
  }

  ngOnDestroy() {
    if (this.addressSub) this.addressSub.unsubscribe();
  }

}
