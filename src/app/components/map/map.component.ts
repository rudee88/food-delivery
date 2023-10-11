import { Component, OnInit } from '@angular/core';

import { GoogleMapsService } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements OnInit {

  constructor(private maps: GoogleMapsService) { }

  ngOnInit() {}

}
