import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  isLoading: boolean;
  addresses: any[] = []

  constructor() { }

  ngOnInit() {
  this.getAddresess();
  }

  getAddresess() {
    this.isLoading = true;
    setTimeout(() => {
      this.addresses = [
      {address: 'Bandar Baru Ampang, Selangor', house: "30A, 1st Floor", id: "djkfda73k2", landmark: 'Ampang', lat: '3.144665133429708', lng: '101.7688121380485', title: 'Work', user_id: '1'},
      {address: 'Jalan Gombak, Kuala Lumpur', house: "59-211-A", id: "kjadjds341", landmark: 'Batu 4', lat: '3.203287561584573', lng: '101.70513540425516', title: 'Home', user_id: '1'},
    ];
    this.isLoading = false;
    },1000);
  }

  onGetIcon(title) {
    const name = title.toLowerCase();
    switch(name) {
      case 'home': return 'home-outline';
      case 'work': return 'briefcase-outline'
      default: return 'location-outline';
    }
  }

  onEditAddress(address) {}

  onDeleteAddress(address) {}

}
