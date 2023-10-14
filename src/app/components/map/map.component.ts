import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements OnInit, AfterViewInit {
  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  googleMaps: any;
  map; any;
  marker: any;
  center = { lat: 3.1448499743415494, lng: 101.7689672668845};

  constructor(
    private maps: GoogleMapsService,
    private renderer: Renderer2,
    private locationService: LocationService
    ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initMap();
  }

  async initMap() {
    try {
      const position = await this.locationService.getCurrentLocation();
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.loadMap();
    } catch(e) {
      console.log(e);
      this.loadMap();
    }
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.maps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        mapTypeControl: false,
        mapTtypeControlOptions: {
          mapTypeId: [googleMaps.MapTypeId.RoadMap, 'RSP Food Delivery']
        }
      });
      const style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            {saturation: -100}
          ]
        }
      ];
      var mapType = new googleMaps.StyledMapType(style, {name: 'Grayscale'});
      this.map.mapTypes.set('RSP Food Delivery', mapType);
      this.map.setMapTypeId('RSP Food Delivery');
      this.renderer.addClass(mapEl, 'visible');
      this.addMaker(location);
    } catch(e) {
      console.log(e);
    }
  }

  addMaker(location) {
    let googleMaps = this.googleMaps;
    const icon = {
      url: 'assets/icon/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50),
    }
    this.marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: true,
      animation: googleMaps.Animation.DROP
    });
  }

}
