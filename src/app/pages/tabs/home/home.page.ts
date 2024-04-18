import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';

import { Restaurant } from 'src/app/models/restaurant.model';
import { User } from 'src/app/models/user.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { BannerService } from 'src/app/services/banner/banner.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

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
  @ViewChild('otp_modal') modal: ModalController;
  banners: any[] = [];
  restaurants: Restaurant[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub: Subscription;
  profile: User;
  profileSubs: Subscription;
  verifyOtp = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private addressService: AddressService,
    private globalService: GlobalService,
    private locationService: LocationService,
    private mapService: GoogleMapsService,
    private profileService: ProfileService,
    private bannerService: BannerService
  ) {}

  ngOnInit() {
    this.getProfile();
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
    // this.profileSubs = this.profileService.profile.subscribe(profile => {
    //   this.profile = profile;
    //   console.log('profile: ', profile);
    //   if (this.profile && !this.profile?.email_verified) {
    //     this.checkEmailVerified();
    //   }
    // });
    this.isLoading = true;
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

  async getProfile() {
    try {
      this.profile = await this.profileService.getProfile();
      console.log('homepage profile: ', this.profile);
      if (this.profile && !this.profile?.email_verified) {
        this.checkEmailVerified();
      }
    } catch(e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }

  async checkEmailVerified() {
    const verify = await this.globalService.showButtonToast('Please verify your email address');
    console.log('verify: ', verify);
    if (verify) this.verifyOtp = true;
  }

  getBanners() {
    this.bannerService.getBanners().then(banners => {
      this.banners = banners;
      console.log('banners: ', this.banners);
    })
    .catch(e => {
      console.log(e);
      let msg;
      if (e?.error?.message) {
        msg = e.error.message;
      }
      this.globalService.errorToast(msg);
    })
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

  onResetOtpModal(value) {
    console.log('value, ',value);
    this.verifyOtp = false;
  }

  onOtpVerified(event) {
    if (event) this.modal.dismiss();
  }

  ngOnDestroy() {
    if (this.addressSub) this.addressSub.unsubscribe();
    // if (this.profileSubs) this.profileSubs.unsubscribe();
  }

}
