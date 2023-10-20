import { Component, OnInit } from '@angular/core';

import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit {
  query: string;

  constructor(
    private globalService: GlobalService,
    private googleMapService: GoogleMapsService
    ) { }

  ngOnInit() {}

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

}
