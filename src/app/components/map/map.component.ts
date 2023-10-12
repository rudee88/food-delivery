import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { GoogleMapsService } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements OnInit {
  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  googleMaps: any;
  map; any;

  constructor(
    private maps: GoogleMapsService,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.maps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      this.map = new googleMaps.Map(mapEl, {
        center: new googleMaps.LatLng(3.1448499743415494, 101.7689672668845),
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
    } catch(e) {
      console.log(e);
    }
  }

}
