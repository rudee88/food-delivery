import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  location: any = {};
  isLocationFetched: boolean;

  constructor(
    private addressService: AddressService,
    private globalService: GlobalService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.location.location_name = 'Locating...';
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', { validators: [Validators.required] }),
      house: new FormControl('', { validators: [Validators.required] }),
      landmark: new FormControl('', { validators: [Validators.required] }),
    });
  }

  fetchLocation(event) {
    this.location = event;
    this.toggleFetched();
  }

  toggleFetched() {
    this.isLocationFetched = !this.isLocationFetched;
  }

  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }

  async onSubmit() {
    try {
      this.toggleSubmit();
      console.log(this.form);
      if (!this.form || !this.isLocationFetched) {
        this.toggleSubmit();
        return;
      }
      const data = {
        title: this.form.value.title,
        landmark: this.form.value.landmark,
        house: this.form.value.house,
        address: this.form.value.address,
        lat: this.location.lat,
        lng: this.location.lng,
      };
      console.log('address: ', data);
      await this.addressService.addAddress(data);
      this.navCtrl.back();
      this.toggleSubmit();
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }
}
