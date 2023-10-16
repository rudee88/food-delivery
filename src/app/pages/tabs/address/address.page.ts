import { Component, OnDestroy, OnInit} from '@angular/core';

import { Address } from './../../../models/address.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { AddressService } from './../../../services/address/address.service';
import { Subscription } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit, OnDestroy {
  isLoading: boolean;
  addresses: Address[] = [];
  addressesSub: Subscription;
  model: any = {
    title: 'No Addresses Added Yet',
    icon: 'location-outline'
  };

  constructor(
    private globalService: GlobalService, 
    private addressService: AddressService,
    private router: Router
    ) {}

  ngOnInit() {
    this.addressesSub = this.addressService.addresses.subscribe(address => {
      console.log('addresses:', address);
      this.addresses = address;
      
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

  onEditAddress(address) {
    console.log(address);
    const navData: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(address)
      }
    }
    this.router.navigate([this.router.url, 'edit-address'], navData);
  }

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
