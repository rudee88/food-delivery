import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchPlace } from 'src/app/models/search-place.model';

import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit, OnDestroy {
  query: string;
  places: SearchPlace[] = [];
  placeSub: Subscription;

  constructor(
    private globalService: GlobalService,
    private googleMapService: GoogleMapsService
    ) { }

  ngOnInit() {
    this.placeSub = this.googleMapService.places.subscribe(places => {
      this.places = places;
    });
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

  onChoosePlace(place) {
    console.log('Choose Place: ', place);
    this.onDismiss(place);
  }

  ngOnDestroy(): void {
      if (this.placeSub) this.placeSub.unsubscribe();
  }

}
