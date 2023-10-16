import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  center: any;
  update: boolean;

  constructor(
    private addressService: AddressService,
    private globalService: GlobalService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
   this.checkForUpdate();
  }

  checkForUpdate() {
    this.location.location_name = 'Locating...';
    this.isLocationFetched = false;
    this.route.queryParamMap.subscribe(async(paramMap) => {
      console.log('data: ', paramMap);
      const dataParam = paramMap.get('data');
      if (dataParam) {
        const data = JSON.parse(dataParam);
        if (data) {
          const address = data;
          this.center = {
            lat: address.lat,
            lng: address.lng
          };
          this.update = true;
          this.location.lat = this.center.lat;
          this.location.lng = this.center.lng;
          this.location.address = address.address;
          this.location.location_name = address.title;
          await this.initForm(address);
          this.toggleFetched();
        } else {
          this.update = false;
          this.initForm();
        }
      }
      
    });
    
  }
 
  initForm(address?) {
    let data = {
      title: null,
      house: null,
      landmark: null
    }
    if (address) {
      data = {
        title: address.title,
        house: address.house,
        landmark: address.landmark
      }
    }
    this.form = new FormGroup({
      title: new FormControl(data.title, { validators: [Validators.required] }),
      house: new FormControl(data.house, { validators: [Validators.required] }),
      landmark: new FormControl(data.landmark, { validators: [Validators.required] }),
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
