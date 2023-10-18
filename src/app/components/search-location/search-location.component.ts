import { Component, OnInit } from '@angular/core';

import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit {

  constructor(private globalService: GlobalService) { }

  ngOnInit() {}

  onSearchChange(event) {
    console.log(event);
  }

  onDismiss(val?) {
    this.globalService.modalDismiss(val);
  }

}
