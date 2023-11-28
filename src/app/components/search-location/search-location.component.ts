import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { SearchPlace } from 'src/app/models/search-place.model';
import { AddressService } from 'src/app/services/address/address.service';

import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

interface GoogleMapResponse {
  address_components: any[];
  formatted_address: string;
}

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit, OnDestroy {
  query: string;
  places: SearchPlace[] = [];
  placeSub: Subscription;
  @Input() from;
  savedPlaces: Address[] = [];
  addressessSub: Subscription;

  constructor(
    private globalService: GlobalService,
    private googleMapService: GoogleMapsService,
    private locationService: LocationService,
    private addressesService: AddressService
    ) { }

  ngOnInit() {
    this.placeSub = this.googleMapService.places.subscribe(places => {
      this.places = places;
    });
    if (this.from) this.getSavedPlaces();
  }

  async getSavedPlaces() {
    this.globalService.showLoader();
    this.addressessSub = this.addressesService.addresses.subscribe(addresses => {
      this.savedPlaces = addresses;
    });
    await this.addressesService.getAddresses();
    this.globalService.hideLoader();
  }

  onSelectSavedPlace(place) {
    this.onDismiss(place);
  }

  async onSearchChange(event) {
    console.log(event);
    this.globalService.showLoader();
    this.query = event.detail.value;
    if (this.query.length > 0) await this.googleMapService.getPlaces(this.query);
    this.globalService.hideLoader();
  }

  onDismiss(val?) {
    this.globalService.modalDismiss(val);
  }

  async onGetCurrentPosition() {
    try {
      this.globalService.showLoader();
      const position = await this.locationService.getCurrentLocation();
      const {latitude, longitude} = position.coords;
      const result: GoogleMapResponse = await this.googleMapService.getAddress(latitude, longitude) as GoogleMapResponse;
      console.log('result: ', result);
      const place: SearchPlace = {
        location_name: result.address_components[0].short_name,
        address: result.formatted_address,
        lat: latitude,
        lng: longitude
      };
      this.globalService.hideLoader();
      this.onDismiss(place);
    } catch(e) {
      console.log(e)
      this.globalService.hideLoader();
      this.globalService.errorToast('Check wether GPS is enabled & the App has its permissions', 5000);
    }
  }

  onChoosePlace(place) {
    console.log('Choose Place: ', place);
    this.onDismiss(place);
  }

  ngOnDestroy(): void {
      if (this.placeSub) this.placeSub.unsubscribe();
      if (this.addressessSub) this.addressessSub.unsubscribe();
  }

}
