import { Component, OnDestroy, OnInit} from '@angular/core';

import { GlobalService } from 'src/app/services/global/global.service';
import { AddressService } from './../../../services/address/address.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit, OnDestroy {
  isLoading: boolean;
  addresses: any[] = [];
  addressesSub: Subscription;
  model: any = {
    title: 'No Addresses Added Yet',
    icon: 'location-outline'
  };

  constructor(private globalService: GlobalService, private addressService: AddressService) {}

  ngOnInit() {
    this.addressesSub = this.addressService.addresses.subscribe(address => {
      console.log('addresses:', address);
      if (address instanceof Array) {
        this.addresses = address;
      } else {
        if (address?.delete) {
          this.addresses = this.addresses.filter(x => x.id != address.id);
        } else if (address?.update) {
          const index = this.addresses.findIndex(x => x.id == address.id);
          this.addresses[index] = address;
        } else {
          this.addresses = this.addresses.concat(address);
        }
      }
    });
    this.getAddresess();
  }

  async getAddresess() {
    this.isLoading = true;
    setTimeout(async() => {
      await this.addressService.getAddresses();
      this.isLoading = false;
    }, 1000);
  }

  onGetIcon(title) {
    return this.globalService.getIcon(title);
  }

  onEditAddress(address) {}

  onDeleteAddress(address) {
    console.log('address: ', address);
    this.globalService.showAlert(
      'Are you sure you want to delete this address?',
      'Confirm',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('cancel');
            return;
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            this.globalService.showLoader();
            await this.addressService.deleteAddress(address);
            this.globalService.hideLoader();
          }
        }
      ]
    );
  }

  ngOnDestroy(): void {
      if (this.addressesSub) this.addressesSub.unsubscribe();
  }
}
